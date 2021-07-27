import React from "react";
import {
  Layout,
  Page,
  Subheading,
  Frame,
  Loading,
  SkeletonBodyText,
} from "@shopify/polaris";
import CompletedOrderCard from "./CompletedOrderCard";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const GET_COMPLETED_ORDERS = gql`
  query getCompletedOrders {
    orders(first: 10, query: "tag:EOM-READY OR status:closed") {
      edges {
        node {
          id
          legacyResourceId
          createdAt
          name
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
        }
      }
    }
  }
`;

const CompletedOrders = ({ title, shopUrl }) => {
  const { loading, error, data } = useQuery(GET_COMPLETED_ORDERS);

  if (loading)
    return (
      <div style={{ height: "100px" }}>
        <Frame>
          <Loading />
          <Page>
            {console.log("loading")}
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
  return (
    <Layout>
      <Layout.Section fullWidth>
        <Subheading>{title}</Subheading>
      </Layout.Section>
      {data.orders?.edges.length > 0 ? (
        data.orders?.edges?.map((order) => {
          return (
            <Layout.Section key={order.node.id} oneHalf>
              <CompletedOrderCard
                customer={order.node.customer}
                products={order.node.lineItems.edges.map((obj) => obj.node)}
                date={order.node.createdAt}
                shipping={order.node.shippingAddress?.formatted}
                orderName={order.node.name}
                orderId={order.node.legacyResourceId}
                fulfilled={order.node.displayFulfillmentStatus === "FULFILLED"}
                shopUrl={shopUrl}
              />
            </Layout.Section>
          );
        })
      ) : (
        <Layout.Section>
          <TextContainer>No orders found</TextContainer>
        </Layout.Section>
      )}
      <Layout.Section oneHalf></Layout.Section>
    </Layout>
  );
};

export default CompletedOrders;
