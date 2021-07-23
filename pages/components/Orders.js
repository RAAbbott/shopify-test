import { Layout, Card, DisplayText, Subheading } from "@shopify/polaris";
import OrderCard from "./OrderCard";

const Orders = (props) => {
  // Props object will have all the order data necessary to display orders

  return (
    <Layout>
      <Layout.Section>
        {/* <DisplayText size="medium">Current Orders</DisplayText> */}
        <Subheading>Current Orders</Subheading>
      </Layout.Section>
      <Layout.Section>
        <OrderCard />
      </Layout.Section>
      <Layout.Section>
        <OrderCard />
      </Layout.Section>
      <Layout.Section>
        <OrderCard />
      </Layout.Section>
      <Layout.Section>
        <OrderCard />
      </Layout.Section>
      <Layout.Section>
        <OrderCard />
      </Layout.Section>
      <Layout.Section>
        <OrderCard />
      </Layout.Section>
      <Layout.Section>
        <OrderCard />
      </Layout.Section>
      <Layout.Section>
        <OrderCard />
      </Layout.Section>
      <Layout.Section>
        <OrderCard />
      </Layout.Section>
    </Layout>
  );
};

export default Orders;
