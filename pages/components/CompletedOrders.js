import React from "react";
import { Layout, Subheading } from "@shopify/polaris";
import CompletedOrderCard from "./CompletedOrderCard";

export default class NewOrders extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { orders, title, shopUrl } = this.props;
    return (
      <Layout>
        <Layout.Section fullWidth>
          <Subheading>{title}</Subheading>
        </Layout.Section>
        {orders.map((order) => {
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
        })}
        <Layout.Section oneHalf></Layout.Section>
      </Layout>
    );
  }
}
