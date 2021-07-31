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
  Button,
  Thumbnail,
  Icon,
} from "@shopify/polaris";
import { ProductsMajor } from "@shopify/polaris-icons";
import { format, formatDistance, subDays } from "date-fns";

class MemoThumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.number === nextProps.number) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <Thumbnail
        alt={this.props.alt}
        source={this.props.source}
        size={this.props.size}
      />
    );
  }
}

const CompletedOrderCard = ({
  customer,
  products,
  date,
  shipping,
  billing,
  completed,
  fulfilled,
  orderName,
  orderId,
  shopUrl,
}) => {
  const productState = {};

  for (const product of products) {
    productState[product.id] = false;
  }

  // products[0].customAttributes[0] = { key: "Custom Name", value: "Archer" };

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
            {customer?.firstName} {customer?.lastName}{" "}
            <Caption>
              <TextStyle variation="subdued">
                {format(new Date(date), "MMMM do")}
              </TextStyle>
            </Caption>
          </Subheading>
          <Caption>
            {/* <TextStyle variation="subdued">Order {orderName}</TextStyle> */}
            <TextStyle variation="subdued">
              <Link
                url={`${shopUrl}/admin/orders/${orderId}`}
                external
                monochrome
              >
                Order {orderName}
              </Link>
            </TextStyle>
          </Caption>
        </Stack>
      }
      sectioned
    >
      <Card.Section title="Products">
        {products.map((product) => (
          <Stack alignment="center" distribution="leading" key={product.id}>
            {console.log("COMPLETED PRODUCT: ", product)}
            {product?.product?.featuredImage?.originalSrc ? (
              <MemoThumb
                alt="Featured Image for Product"
                source={product.product.featuredImage?.originalSrc}
                size="small"
              />
            ) : (
              <MemoThumb
                alt="Featured Image for Product"
                source={ProductsMajor}
                size="small"
              />
            )}

            <TextStyle
              variation={completedProducts[product.id] ? "positive" : ""}
            >
              {product.title}{" "}
              {product.variantTitle ? ` / ${product.variantTitle}` : ""}
              {product.customAttributes.length > 0 &&
                product.customAttributes?.map((node) => ` / ${node.value}`)}
            </TextStyle>
          </Stack>
        ))}
      </Card.Section>
      <Collapsible
        open={open}
        id="basic-collapsible"
        transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
        expandOnPrint
      >
        <Card.Section></Card.Section>
        <Card.Section
          title={
            <Stack alignment="center" distribution="equalSpacing">
              <Subheading>Order Details</Subheading>
            </Stack>
          }
        >
          <Card.Section title="Customer">
            <Link
              url={`${shopUrl}/admin/customers/${customer.legacyResourceId}`}
              external
              monochrome
            >
              {customer?.firstName} {customer?.lastName}
            </Link>
            <p>{customer?.email || "No email found"}</p>
          </Card.Section>
          {/* <Card.Section title="Date">
            <p>{date}</p>
          </Card.Section> */}
          <Card.Section title="Shipping">
            <p>{shipping?.join("\n") || "No shipping info found"}</p>
          </Card.Section>
        </Card.Section>
      </Collapsible>

      <Stack alignment="center" distribution="equalSpacing">
        <Badge status={fulfilled ? "success" : "warning"}>
          {fulfilled ? "Fulfilled" : "Unfulfilled"}
        </Badge>
        <Button onClick={handleToggle}>Details</Button>
      </Stack>
    </Card>
  );
};

export default CompletedOrderCard;
