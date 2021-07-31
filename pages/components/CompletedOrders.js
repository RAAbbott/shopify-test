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

const CompletedOrders = ({ orders, title, shopUrl }) => {
  return (
    <Layout>
      <Layout.Section fullWidth>
        <Subheading>{title}</Subheading>
      </Layout.Section>
      {orders.length > 0 ? (
        orders.map((order) => {
          return (
            <Layout.Section key={order.id} oneHalf>
              <CompletedOrderCard
                customer={order.customer}
                products={order.lineItems.edges.map((obj) => obj.node)}
                date={order.createdAt}
                shipping={order.shippingAddress?.formatted}
                orderName={order.name}
                orderId={order.legacyResourceId}
                fulfilled={order.displayFulfillmentStatus === "FULFILLED"}
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
