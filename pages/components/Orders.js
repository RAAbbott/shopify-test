import { Layout, Card, DisplayText, Subheading } from "@shopify/polaris";
import OrderCard from "./OrderCard";
import OrderCardTable from "./OrderCardTable";
import OrderList from "./OrderList";

const Orders = ({ orders, title, completed }) => {
  // Props object will have all the order data necessary to display orders

  return (
    <Layout>
      <Layout.Section fullWidth>
        {/* <DisplayText size="medium">Current Orders</DisplayText> */}
        <Subheading>{title}</Subheading>
      </Layout.Section>
      <OrderList orders={orders} completed={completed} />
    </Layout>
  );
};

export default Orders;
