import { Card, List } from "@shopify/polaris";

const OrderCard = (props) => {
  // Props will have customer object and order object
  return (
    <Card
      title="Lizzy Abbott"
      sectioned
      secondaryFooterActions={[{ content: "Details" }]}
      primaryFooterAction={{ content: "Complete" }}
    >
      <List type="bullet">
        <List.Item>Custom Name Onesie / Natural / 6 months / Archer</List.Item>
        <List.Item>Red shirt</List.Item>
        <List.Item>Green shirt</List.Item>
      </List>
    </Card>
  );
};

export default OrderCard;
