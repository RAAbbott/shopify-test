import {
  Subheading,
  TextStyleProps,
  TextContainer,
  Heading,
  TextStyle,
  Banner,
} from "@shopify/polaris";

const Products = () => {
  return (
    <>
      {/* <Subheading>Products On Order</Subheading> */}
      {/* <TextContainer>
        <Heading>
          Coming soon to{" "}
          <TextStyle variation="strong">Easy Order Manager</TextStyle>
        </Heading>
        <p>
          This tab is not yet active, but will soon be implemented in order to
          provide an easy-to-use interface to see all products on order
        </p>
      </TextContainer> */}
      <Banner title="Coming Soon">
        <p>This feature is coming soon to Easy Order Manager</p>
      </Banner>
    </>
  );
};

export default Products;
