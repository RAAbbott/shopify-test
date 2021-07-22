import React from "react";
import { Page, Card, Layout } from "@shopify/polaris";

export default class Index extends React.Component {
  render() {
    return (
      <Page
        breadcrumbs={[{ content: "Products", url: "/products" }]}
        title="Hello World"
        primaryAction={{ content: "Add Products" }}
      >
        <Layout>
          <Layout.Section>
            <Card title="Test" oneHalf>
              <p>Hello there</p>
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card title="testss">
              <p>Hello there</p>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}
