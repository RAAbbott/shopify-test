import React from "react";
import { Layout } from "@shopify/polaris";
import OrderCard from "./OrderCard";

const OrderList = ({ orders, completed }) => {
  // GraphQL query to retrieve products and their prices
  return (
    <>
      {orders.map((order) => (
        <Layout.Section key={order.id} oneHalf>
          <OrderCard
            customer={order.customer}
            products={order.lineItems.edges.map((obj) => obj.node)}
            date={order.createdAt}
            shipping={order.shippingAddress?.formatted}
            billing={order.billingAddress?.formatted}
            completed={completed}
          />
        </Layout.Section>
      ))}
      <Layout.Section oneHalf></Layout.Section>
    </>
  );
};

export default OrderList;
