import {
  Subheading,
  TextStyleProps,
  TextContainer,
  Heading,
  TextStyle,
} from "@shopify/polaris";

const Products = () => {
  return (
    <>
      {/* <Subheading>Products On Order</Subheading> */}
      <TextContainer>
        <Heading>
          Coming soon to{" "}
          <TextStyle variation="strong">Easy Order Manager</TextStyle>
        </Heading>
        <p>
          This tab is not yet active, but will soon be implemented in order to
          provide an easy-to-use interface to see all products on order
        </p>
      </TextContainer>
    </>
  );
};

export default Products;
