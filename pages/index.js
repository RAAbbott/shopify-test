import { useState, useCallback, useEffect } from "react";
import { Page, Tabs, Badge } from "@shopify/polaris";
import Orders from "./components/Orders";
import Products from "./components/Products";
import CompletedOrders from "./components/CompletedOrders";
import gql from "graphql-tag";
import { Query } from "react-apollo";

// GRAPHQL
const GET_PRODUCTS_BY_ID = gql`
  query getOrders {
    orders(first: 10, query: "status:open") {
      edges {
        node {
          id
          createdAt
          tags
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

const Index = () => {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  return (
    <Query query={GET_PRODUCTS_BY_ID}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading…</div>;
        if (error) return <div>{error.message}</div>;

        console.log(data);
        const orders = data?.orders?.edges.map((obj) => obj.node);

        const views = [
          <Orders
            orders={orders.filter((order) => !order.tags.includes("EOM-READY"))}
            title="New Orders"
          />,
          <Orders
            orders={orders.filter((order) => order.tags.includes("EOM-READY"))}
            title="Completed Orders"
            completed={
              orders.filter((order) => order.tags.includes("EOM-READY"))
                .length > 0
            }
          />,
          <Products />,
        ];

        const tabs = [
          {
            id: "new-orders",
            content: (
              <span>
                New Orders <Badge status="new">10+</Badge>
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
            content: (
              <span>
                Products
                {/* <Badge status="new">10+</Badge> */}
              </span>
            ),
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
              <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                <br />
                {views[selected]}
              </Tabs>
            </div>
          </Page>
        );
      }}
    </Query>
  );
};

export default Index;
