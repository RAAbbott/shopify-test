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
import { useQuery } from "@apollo/react-hooks";
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
    orders(
      first: 15
      query: "fulfillment_status:unfulfilled, status:open, -tag:EOM-READY"
    ) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

const Index = () => {
  const [selected, setSelected] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const { loading, error, data } = useQuery(GET_ORDER_INFO);

  const handleTabChange = (selectedTabIndex) => {
    setSelected(selectedTabIndex);
  };

  const updateCount = (count) => {
    setOrderCount(count);
  };

  useEffect(() => {
    if (loading === false && data) {
      setOrderCount(data?.orders?.edges.length);
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

  const orderCounts = data.orders?.edges?.length;

  const views = [
    <NewOrders
      title="New Orders"
      shopUrl={data.shop?.domains[0]?.url}
      updateCount={updateCount}
    />,
    <CompletedOrders
      shopUrl={data.shop?.domains[0]?.url}
      title="Completed Orders"
      updateCount={updateCount}
    />,
    <Products />,
  ];

  const tabs = [
    {
      id: "new-orders",
      content: (
        <span>
          New Orders{" "}
          {orderCounts > 0 && (
            <Badge status="new">{orderCounts > 10 ? "10+" : orderCounts}</Badge>
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
    <Page title="Easy Order Manager" primaryAction={{ content: "Sync Orders" }}>
      <div>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <br />
          {views[selected]}
        </Tabs>
      </div>
    </Page>
  );
};

export default Index;
