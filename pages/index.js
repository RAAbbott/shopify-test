import { useState, useCallback, useEffect } from "react";
import {
  Page,
  Tabs,
  Badge,
  Frame,
  Loading,
  SkeletonBodyText,
  Toast,
} from "@shopify/polaris";
import Products from "./components/Products";
import CompletedOrders from "./components/CompletedOrders";
import { AppBridgeContext } from "@shopify/app-bridge-react/context";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
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
    orders(first: 15) {
      edges {
        node {
          id
          legacyResourceId
          createdAt
          closed
          name
          tags
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
            legacyResourceId
          }
          shippingAddress {
            formatted
          }
        }
      }
    }
  }
`;

const ADD_TAGS = gql`
  mutation tagsAdd($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      node {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const Index = () => {
  const [selected, setSelected] = useState(0);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(false);
  // const [cardLoading, setCardLoading] = useState(false);
  const { loading, error, data } = useQuery(GET_ORDER_INFO);
  const [
    handleSubmit,
    { loading: mutateLoading, error: mutateError },
  ] = useMutation(ADD_TAGS, {
    onCompleted: (data) => {
      const prevOrders = orders.slice();
      prevOrders[
        orders.findIndex((order) => order.id === data?.tagsAdd?.node?.id)
      ].tags.push("EOM-READY");
      setOrders(prevOrders);
      setToast(true);
      // setCardLoading(false);
    },
  });

  const handleTabChange = (selectedTabIndex) => {
    setSelected(selectedTabIndex);
  };

  const updateOrders = (mutateProps, id) => {
    handleSubmit(mutateProps);
  };

  const getNewOrders = () => {
    console.log(orders);
    return orders.filter(
      (order) => !order?.tags.includes("EOM-READY") && !order.closed
    );
  };

  const getCompletedOrders = () => {
    return orders.filter(
      (order) => order?.tags.includes("EOM-READY") || order.closed
    );
  };

  useEffect(() => {
    if (loading === false && data) {
      setOrders(data?.orders?.edges.map((obj) => obj.node));
    }
  }, [loading, data]);

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

  console.log(orders);
  const views = [
    <NewOrders
      orders={orders.filter(
        (order) => !order?.tags.includes("EOM-READY") && !order.closed
      )}
      title="New Orders"
      shopUrl={data.shop?.domains[0]?.url}
      updateOrders={updateOrders}
    />,
    <CompletedOrders
      orders={orders.filter(
        (order) => order?.tags.includes("EOM-READY") || order.closed
      )}
      shopUrl={data.shop?.domains[0]?.url}
      title="Completed Orders"
    />,
    <Products />,
  ];

  const orderCount = orders.filter(
    (order) => !order?.tags.includes("EOM-READY") && !order.closed
  ).length;

  const tabs = [
    {
      id: "new-orders",
      content: (
        <span>
          New Orders{" "}
          {orderCount > 0 && (
            <Badge status="new">{orderCount > 10 ? "10+" : orderCount}</Badge>
          )}
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
      // primaryAction={{ content: "Sync Orders" }}
    >
      <div>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <br />
          {views[selected]}
        </Tabs>
      </div>
      {toast && (
        <Frame>
          <Toast
            content="Successfully Complete Order"
            onDismiss={() => setToast(false)}
            duration={3000}
          />
        </Frame>
      )}
    </Page>
  );
};

export default Index;
