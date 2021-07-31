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
  Thumbnail,
  Icon,
  Spinner,
} from "@shopify/polaris";
import { format, formatDistance, subDays } from "date-fns";
import { ProductsMajor } from "@shopify/polaris-icons";

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

const OrderCard = ({
  customer,
  products,
  date,
  shipping,
  orderName,
  orderId,
  legacyId,
  shopUrl,
  onUpdate,
  loading,
}) => {
  const productState = {};

  for (const product of products) {
    productState[product.id] = false;
  }

  products[0].customAttributes[0] = { key: "Custom Name", value: "Archer" };

  const [open, setOpen] = useState(false);
  const [completedProducts, updateCompletedProducts] = useState(productState);
  const [showSpinner, setShowSpinner] = useState(loading);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);
  // const productToggle = (id) => {
  //   updateCompletedProducts(() => ({
  //     ...completedProducts,
  //     [id]: !completedProducts[id],
  //   }));
  // };

  console.log(customer);

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
            <TextStyle variation="subdued">
              <Link
                url={`${shopUrl}/admin/orders/${legacyId}`}
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
      secondaryFooterActions={[{ content: "Details", onAction: handleToggle }]}
      primaryFooterAction={{
        content: showSpinner ? (
          <Spinner accessibilityLabel="Loading Spinner" size="small" />
        ) : (
          "Complete"
        ),
        onAction: () => {
          setShowSpinner(true);
          onUpdate(
            { variables: { id: orderId, tags: ["EOM-READY"] } },
            orderId
          );
        },
      }}
    >
      <Card.Section title="Products">
        {products.map((product) => (
          <Stack alignment="center" distribution="leading" key={product.id}>
            {product.product.featuredImage?.originalSrc ? (
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
              {product.customAttributes.length &&
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
              {/* <Button onClick={handleToggle} size="slim">
                Expand
              </Button> */}
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
            <p>{format(new Date(date), "MMMM do")}</p>
          </Card.Section> */}
          <Card.Section title="Shipping">
            <p>{shipping?.join("\n") || "No address found"}</p>
          </Card.Section>
        </Card.Section>
      </Collapsible>
    </Card>
  );
};

export default OrderCard;
