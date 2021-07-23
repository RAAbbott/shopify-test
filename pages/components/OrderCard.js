import {
  Card,
  IndexTable,
  ResourceList,
  ResourceItem,
  useIndexResourceState,
  TextStyle,
} from "@shopify/polaris";

const OrderCard = () => {
  const products = [
    {
      id: "0",
      url: "products/341",
      name: "Custom Name Onesie",
      // location: "Decatur, USA",
      // orders: 20,
      // amountSpent: "$2,400",
      status: "success",
    },
    {
      id: "1",
      url: "products/256",
      name: "Mama Tee",
      // location: "Los Angeles, USA",
      // orders: 30,
      // amountSpent: "$140",
      status: "subdued",
    },
  ];
  const customers = [
    {
      id: "3411",
      url: "products/341",
      name: "Custom Name Onesie",
      location: "Decatur, USA",
      orders: 20,
      amountSpent: "$2,400",
      status: "success",
    },
    {
      id: "2561",
      url: "products/256",
      name: "test",
      location: "Los Angeles, USA",
      orders: 30,
      amountSpent: "$140",
      status: "subdued",
    },
  ];
  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(customers);

  const rowMarkup = products.map(({ id, name, status }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
      status={status}
    >
      <IndexTable.Cell>
        <TextStyle variation="strong">{name}</TextStyle>
      </IndexTable.Cell>
      {/* <IndexTable.Cell>{location}</IndexTable.Cell>
        <IndexTable.Cell>{orders}</IndexTable.Cell>
        <IndexTable.Cell>{amountSpent}</IndexTable.Cell> */}
    </IndexTable.Row>
  ));

  return (
    <Card
      title="Lizzy Abbott"
      secondaryFooterActions={[{ content: "Details" }]}
      primaryFooterAction={{ content: "Complete" }}
      sectioned
    >
      <IndexTable
        resourceName={resourceName}
        itemCount={customers.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: "Name" },
          { title: "Location" },
          { title: "Order count" },
          { title: "Amount spent" },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  );
};

export default OrderCard;
