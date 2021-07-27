import { useState, useCallback, useEffect } from "react";
import {
  Page,
  Tabs,
  Badge,
  Frame,
  Loading,
  SkeletonBodyText,
} from "@shopify/polaris";
import Products from "./components/Products";
import CompletedOrders from "./components/CompletedOrders";
import { AppBridgeContext } from "@shopify/app-bridge-react/context";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import React from "react";
import NewOrders from "./components/NewOrders";

// GRAPHQL
const GET_ORDER_INFO = gql`
  query getOrderInfo {
    shop {
      name
      domains {
        url
      }
    }
    orders(first: 10) {
      edges {
        node {
          id
          legacyResourceId
          createdAt
          name
          tags
          closed
          cancelledAt
          displayFulfillmentStatus
          lineItems(first: 10) {
            edges {
              node {
                id
                title
                variantTitle
                variant {
                  id
                  price
                }
                product {
                  featuredImage {
                    id
                    originalSrc
                  }
                  id
                }
                customAttributes {
                  key
                  value
                }
              }
            }
          }
          customer {
            id
            firstName
            lastName
            email
          }
          shippingAddress {
            formatted
          }
          billingAddress {
            formatted
          }
        }
      }
    }
  }
`;

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: 0 };
  }

  handleTabChange = (selectedTabIndex) =>
    this.setState((prevState) => {
      return {
        ...prevState,
        selected: selectedTabIndex,
      };
    });

  render() {
    return (
      <Query query={GET_ORDER_INFO}>
        {({ data, loading, error }) => {
          if (loading)
            return (
              <div style={{ height: "100px" }}>
                <Frame>
                  <Loading />
                  <Page>
                    <SkeletonBodyText />
                    <br />
                    <SkeletonBodyText />
                    <br />
                    <SkeletonBodyText />
                    <br />
                    <SkeletonBodyText />
                  </Page>
                </Frame>
              </div>
            );
          if (error) return <div>{error.message}</div>;

          const orders = data.orders?.edges?.map((obj) => obj.node);
          const newOrders = orders.filter(
            (order) =>
              !order.tags.includes("EOM-READY") && order.closed === false
          );
          const completedOrders = orders.filter(
            (order) => order.tags.includes("EOM-READY") || order.closed === true
          );

          const views = [
            <NewOrders
              orders={newOrders}
              title="New Orders"
              shopUrl={data.shop?.domains[0]?.url}
            />,
            <CompletedOrders
              orders={completedOrders}
              shopUrl={data.shop?.domains[0]?.url}
              title="Completed Orders"
              completed
            />,
            <Products />,
          ];

          const tabs = [
            {
              id: "new-orders",
              content: (
                <span>
                  New Orders{" "}
                  <Badge status="new">
                    {newOrders.length > 10 ? "10+" : newOrders.length}
                  </Badge>
                </span>
              ),
              accessibilityLabel: "New Orders Page",
              panelID: "new-orders-content",
            },
            {
              id: "completed-orders",
              content: "Completed Orders",
              accessibilityLabel: "Completed Orders Page",
              panelID: "completed-orders-content",
            },
            {
              id: "products",
              content: <span>Products</span>,
              accessibilityLabel: "Products Page",
              panelID: "products-content",
            },
          ];

          return (
            <Page
              title="Easy Order Manager"
              primaryAction={{ content: "Sync Orders" }}
            >
              <div>
                <Tabs
                  tabs={tabs}
                  selected={this.state.selected}
                  onSelect={this.handleTabChange}
                >
                  <br />
                  {views[this.state.selected]}
                </Tabs>
              </div>
            </Page>
          );
        }}
      </Query>
    );
  }
}
