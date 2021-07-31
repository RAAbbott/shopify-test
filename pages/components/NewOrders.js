import React from "react";
import { Layout, Subheading, TextContainer } from "@shopify/polaris";
import OrderCard from "./OrderCard";

const NewOrders = ({ orders, title, shopUrl, updateOrders }) => {
  return (
    <Layout>
      <Layout.Section fullWidth>
        <Subheading>{title}</Subheading>
      </Layout.Section>
      {orders.length > 0 ? (
        orders?.map((order) => {
          return (
            <Layout.Section key={order.id} oneHalf>
              <OrderCard
                customer={order.customer}
                products={order.lineItems.edges.map((obj) => obj.node)}
                date={order.createdAt}
                shipping={order.shippingAddress?.formatted}
                orderName={order.name}
                legacyId={order.legacyResourceId}
                orderId={order.id}
                shopUrl={shopUrl}
                onUpdate={updateOrders}
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

export default NewOrders;
