import { useState, useCallback } from "react";
import {
  Card,
  List,
  Subheading,
  Collapsible,
  Stack,
  TextStyle,
  Caption,
  Link,
  Badge,
} from "@shopify/polaris";
import { format, formatDistance, subDays } from "date-fns";

const OrderCard = ({
  customer,
  products,
  date,
  shipping,
  billing,
  completed,
}) => {
  const productState = {};

  for (const product of products) {
    productState[product.id] = false;
  }

  products[0].customAttributes[0] = { key: "Custom Name", value: "Archer" };

  console.log(products);
  // Props will have customer object and order object
  const [open, setOpen] = useState(false);
  const [completedProducts, updateCompletedProducts] = useState(productState);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);
  const productToggle = (id) => {
    updateCompletedProducts(() => ({
      ...completedProducts,
      [id]: !completedProducts[id],
    }));
  };

  return (
    <Card
      title={
        <Stack alignment="center" distribution="equalSpacing">
          <Subheading>
            {customer.firstName} {customer.lastName}{" "}
            {/* <TextStyle variation="subdued">July 13th</TextStyle> */}
            <Caption>
              <TextStyle variation="subdued">
                {format(new Date(date), "MMMM do")}
              </TextStyle>
              {/* <TextStyle variation="subdued">
                {formatDistance(subDays(new Date(), 3), new Date(), {
                  addSuffix: true,
                })}
              </TextStyle> */}
            </Caption>
          </Subheading>
          <Caption>
            <TextStyle variation="subdued">Order #1273</TextStyle>
          </Caption>
        </Stack>
      }
      sectioned
      secondaryFooterActions={[{ content: "Details", onAction: handleToggle }]}
      primaryFooterAction={!completed && { content: "Complete" }}
      subdued={completed}
    >
      <Card.Section title="Products">
        <List type="bullet">
          {products.map((product) => (
            <List.Item key={product.id}>
              <Stack alignment="center" distribution="equalSpacing">
                <TextStyle
                  variation={completedProducts[product.id] ? "positive" : ""}
                >
                  {product.title}{" "}
                  {product.variantTitle ? ` / ${product.variantTitle}` : ""}
                  {product.customAttributes.length &&
                    product.customAttributes?.map((node) => ` / ${node.value}`)}
                </TextStyle>
                {/* {!completed && (
                  <Link
                    removeUnderline
                    key="complete-product"
                    onClick={() => productToggle(product.id)}
                  >
                    <Caption>
                      {completedProducts[product.id]
                        ? "Mark Incomplete"
                        : "Mark Complete"}
                    </Caption>
                  </Link>
                )} */}
              </Stack>
            </List.Item>
          ))}
        </List>
      </Card.Section>
      <Collapsible
        open={open}
        id="basic-collapsible"
        transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
        expandOnPrint
      >
        <Card.Section></Card.Section>
        <Card.Section
          title={
            <Stack alignment="center" distribution="equalSpacing">
              <Subheading>Order Details</Subheading>
              {/* <Button onClick={handleToggle} size="slim">
                Expand
              </Button> */}
            </Stack>
          }
        >
          <Card.Section title="Customer">
            <p>
              {customer.firstName} {customer.lastName}
            </p>
            <p>{customer.email || "No email found"}</p>
          </Card.Section>
          <Card.Section title="Date">
            <p>{date}</p>
          </Card.Section>
          <Card.Section title="Shipping">
            <p>{shipping?.join("\n") || "No address found"}</p>
          </Card.Section>
          {/* <Card.Section title="Billing Address">
            <p>{billing || "No address found"}</p>
          </Card.Section> */}
        </Card.Section>
      </Collapsible>
    </Card>
  );
};

export default OrderCard;
