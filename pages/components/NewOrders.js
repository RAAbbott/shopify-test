import React, { useEffect, useState } from "react";
import {
  Layout,
  Page,
  Subheading,
  Frame,
  Loading,
  SkeletonBodyText,
  TextContainer,
} from "@shopify/polaris";
import OrderCard from "./OrderCard";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

const GET_NEW_ORDERS = gql`
  query getNewOrders {
    orders(
      first: 10
      query: "fulfillment_status:unfulfilled, status:open, -tag:EOM-READY"
    ) {
      edges {
        node {
          id
          legacyResourceId
          createdAt
          name
          lineItems(first: 10) {
            edges {
              node {
                id
                title
                variantTitle
                variant {
                  id
                  price
                }
                product {
                  featuredImage {
                    id
                    originalSrc
                  }
                  id
                }
                customAttributes {
                  key
                  value
                }
              }
            }
          }
          customer {
            id
            firstName
            lastName
            email
          }
          shippingAddress {
            formatted
          }
        }
      }
    }
  }
`;

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

const NewOrders = ({ title, shopUrl, updateCount }) => {
  const { loading, error, data } = useQuery(GET_NEW_ORDERS);
  const [updateOrderTags] = useMutation(ADD_TAGS);
  const [orders, setOrders] = useState([]);

  const updateOrders = (mutateProps, id) => {
    updateOrderTags(mutateProps);
    updateCount(orders.length - 1);
    setOrders(orders.filter((order) => order.id !== id));
  };

  useEffect(() => {
    if (loading === false && data) {
      setOrders(data.orders?.edges?.map((obj) => obj.node));
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div style={{ height: "100px" }}>
        <Frame>
          <Loading />
          <Page>
            <SkeletonBodyText />
            <br />
            <SkeletonBodyText />
            <br />
            <SkeletonBodyText />
            <br />
            <SkeletonBodyText />
          </Page>
        </Frame>
      </div>
    );
  }
  if (error) return <div>{error.message}</div>;

  return (
    <Layout>
      <Layout.Section fullWidth>
        <Subheading>{title}</Subheading>
      </Layout.Section>
      {orders.length > 0 ? (
        orders?.map((order) => {
          return (
            <Layout.Section key={order.id} oneHalf>
              <OrderCard
                customer={order.customer}
                products={order.lineItems.edges.map((obj) => obj.node)}
                date={order.createdAt}
                shipping={order.shippingAddress?.formatted}
                orderName={order.name}
                legacyId={order.legacyResourceId}
                orderId={order.id}
                shopUrl={shopUrl}
                onUpdate={updateOrders}
              />
            </Layout.Section>
          );
        })
      ) : (
        <Layout.Section>
          <TextContainer>No orders found</TextContainer>
        </Layout.Section>
      )}
      <Layout.Section oneHalf></Layout.Section>
    </Layout>
  );
};

export default NewOrders;
