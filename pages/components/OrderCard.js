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
} from "@shopify/polaris";
import { format, formatDistance, subDays } from "date-fns";
import { ProductsMajor } from "@shopify/polaris-icons";
import gql from "graphql-tag";
import { Query, Mutation, useMutation } from "react-apollo";

const ADD_TAGS = gql`
  mutation tagsAdd($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      node {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

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
}) => {
  const productState = {};

  for (const product of products) {
    productState[product.id] = false;
  }

  products[0].customAttributes[0] = { key: "Custom Name", value: "Archer" };

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
        content: "Complete",
        onAction: () => {
          console.log("action!");
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
            <p>
              {customer?.firstName} {customer?.lastName}
            </p>
            <p>{customer?.email || "No email found"}</p>
          </Card.Section>
          <Card.Section title="Date">
            <p>{date}</p>
          </Card.Section>
          <Card.Section title="Shipping">
            <p>{shipping?.join("\n") || "No address found"}</p>
          </Card.Section>
        </Card.Section>
      </Collapsible>
    </Card>
  );
};

export default OrderCard;

// export default class OrderCard extends React.Component {
//   constructor(props) {
//     super(props);
//     const productState = {};

//     for (const product of props.products) {
//       productState[product.id] = false;
//     }

//     this.state = {
//       open: false,
//       completedProducts: productState,
//     };
//   }

//   handleToggle = () =>
//     this.setState((prevState) => ({ ...prevState, open: !prevState.open }));

//   completeOrder = (handleSubmit) => {
//     let promise = new Promise((resolve) => resolve());

//     promise = promise.then(() =>
//       handleSubmit({
//         variables: { id: this.props.orderId, tags: ["EOM-READY"] },
//       })
//     );

//     if (promise) {
//       console.log("ordertoremove in ordercard: ", this.props.orderId);
//       promise.then(() => this.props.onUpdate(this.props.orderId));
//     }
//   };

//   render() {
//     const {
//       customer,
//       products,
//       date,
//       shipping,
//       billing,
//       completed,
//       orderName,
//       legacyId,
//       shopUrl,
//     } = this.props;

//     // const MemoThumb = React.memo(function MemoThumb({ source, alt, size }) {
//     //   return <Thumbnail alt={alt} source={source} size={size} />;
//     // });
//     return (
//       <Mutation mutation={ADD_TAGS}>
//         {(handleSubmit, { error, data }) => {
//           const showToast = this.state.hasResults && (
//             <Toast
//               content="Successfully Completed Orders"
//               onDismiss={() => this.setState({ hasResults: false })}
//             />
//           );
//           return (
//             <Card
//               title={
//                 <Stack alignment="center" distribution="equalSpacing">
//                   <Subheading>
//                     {customer?.firstName} {customer?.lastName}{" "}
//                     <Caption>
//                       <TextStyle variation="subdued">
//                         {format(new Date(date), "MMMM do")}
//                       </TextStyle>
//                     </Caption>
//                   </Subheading>
//                   <Caption>
//                     {/* <TextStyle variation="subdued">Order {orderName}</TextStyle> */}
//                     <TextStyle variation="subdued">
//                       <Link
//                         url={`${shopUrl}/admin/orders/${legacyId}`}
//                         external
//                         monochrome
//                       >
//                         Order {orderName}
//                       </Link>
//                     </TextStyle>
//                   </Caption>
//                 </Stack>
//               }
//               sectioned
//               secondaryFooterActions={[
//                 { content: "Details", onAction: this.handleToggle },
//               ]}
//               primaryFooterAction={{
//                 content: "Complete",
//                 onAction: () => this.completeOrder(handleSubmit),
//               }}
//               subdued={completed}
//             >
//               <Card.Section title="Products">
//                 {products.map((product) => (
//                   <Stack
//                     alignment="center"
//                     distribution="leading"
//                     key={product.id}
//                   >
//                     {product.product.featuredImage?.originalSrc ? (
//                       <MemoThumb
//                         alt="Featured Image for Product"
//                         source={product.product.featuredImage?.originalSrc}
//                         size="small"
//                       />
//                     ) : (
//                       <Thumbnail
//                         alt="Featured Image for Product"
//                         source={ProductsMajor}
//                         size="small"
//                       />
//                     )}

//                     <TextStyle
//                       variation={
//                         this.state.completedProducts[product.id]
//                           ? "positive"
//                           : ""
//                       }
//                     >
//                       {product.title}{" "}
//                       {product.variantTitle ? ` / ${product.variantTitle}` : ""}
//                       {product.customAttributes.length > 0 &&
//                         product.customAttributes?.map(
//                           (node) => ` / ${node.value}`
//                         )}
//                     </TextStyle>
//                   </Stack>
//                 ))}
//               </Card.Section>
//               <Collapsible
//                 open={this.state.open}
//                 id="basic-collapsible"
//                 transition={{
//                   duration: "200ms",
//                   timingFunction: "ease-in-out",
//                 }}
//                 expandOnPrint
//               >
//                 <Card.Section></Card.Section>
//                 <Card.Section
//                   title={
//                     <Stack alignment="center" distribution="equalSpacing">
//                       <Subheading>Order Details</Subheading>
//                       {/* <Button onClick={handleToggle} size="slim">
//                   Expand
//                 </Button> */}
//                     </Stack>
//                   }
//                 >
//                   <Card.Section title="Customer">
//                     <p>
//                       {customer?.firstName} {customer?.lastName}
//                     </p>
//                     <p>{customer?.email || "No email found"}</p>
//                   </Card.Section>
//                   <Card.Section title="Date">
//                     <p>{date}</p>
//                   </Card.Section>
//                   <Card.Section title="Shipping">
//                     <p>{shipping?.join("\n") || "No address found"}</p>
//                   </Card.Section>
//                 </Card.Section>
//               </Collapsible>
//             </Card>
//           );
//         }}
//       </Mutation>
//     );
//   }
// }
