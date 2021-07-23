import { useState, useCallback, useEffect } from "react";
import { Page, Card, Layout, Tabs, DisplayText } from "@shopify/polaris";
import OrderCard from "./components/OrderCard";
import Orders from "./components/Orders";
import ProductCard from "./components/ProductCard";
import Products from "./components/Products";
import axios from "axios";

const Index = () => {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  useEffect(() => {
    const getOrders = async () => {
      await axios.get("/orders");
    };

    getOrders();
  }, []);

  const views = [<Orders />, <Products />];

  const tabs = [
    {
      id: "orders",
      content: "Orders",
      accessibilityLabel: "All customers",
      panelID: "all-customers-content-1",
    },
    {
      id: "accepts-marketing-1",
      content: "Products",
      panelID: "accepts-marketing-content-1",
    },
  ];

  return (
    <Page
      title="Easy Order Manager"
      primaryAction={{ content: "Add Products" }}
    >
      <div>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <br />
          {views[selected]}
        </Tabs>
      </div>
    </Page>
  );
};

export default Index;
