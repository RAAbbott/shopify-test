import { Layout, Card, DisplayText, Subheading } from "@shopify/polaris";

const Orders = (props) => {
  // Props object will have all the order data necessary to display orders

  return (
    <Layout>
      <Layout.Section>
        {/* <DisplayText size="medium">Current Orders</DisplayText> */}
        <Subheading>Current Orders</Subheading>
      </Layout.Section>
      <Layout.Section oneHalf>
        <Card title="Lizzy Abbott" sectioned>
          <p>Hello there</p>
        </Card>
      </Layout.Section>
      <Layout.Section oneHalf>
        <Card title="testss" sectioned>
          <p>Hello there</p>
        </Card>
      </Layout.Section>
      <Layout.Section oneHalf>
        <Card title="testss" sectioned>
          <p>Hello there</p>
        </Card>
      </Layout.Section>
      <Layout.Section oneHalf></Layout.Section>
    </Layout>
  );
};

export default Orders;
