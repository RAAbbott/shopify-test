import React from "react";
import { Layout, Subheading } from "@shopify/polaris";
import OrderCard from "./OrderCard";

export default class NewOrders extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(this.props.number, nextProps.number);
    if (this.props.number === nextProps.number) {
      return false;
    } else {
      return true;
    }
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
              <OrderCard
                customer={order.customer}
                products={order.lineItems.edges.map((obj) => obj.node)}
                date={order.createdAt}
                shipping={order.shippingAddress?.formatted}
                orderName={order.name}
                legacyId={order.legacyResourceId}
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
