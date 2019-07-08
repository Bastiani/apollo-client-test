/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

import createQueryRenderer from "./apollo/createQueryRenderer";
import { query, subscription } from "./ProductQueries";
import logo from "./logo.svg";
import "./App.css";

const ProductList = ({ data, subscribeToMore }) => {
  useEffect(() => subscribeToMore(), []);
  return (
    data &&
    data.products &&
    data.products.map(product => (
      <div key={`${product.id} - key`}>
        <p>
          {product.description} - {product.price}
        </p>
      </div>
    ))
  );
};

function App({ data, subscribeToMore }) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <ProductList data={data} subscribeToMore={subscribeToMore} />
        </p>
      </header>
    </div>
  );
}

export default createQueryRenderer(App, {
  query,
  subscription,
  updateQuery: (prev, { subscriptionData }) => {
    if (!subscriptionData.data) return prev;

    const newProduct = subscriptionData.data.productAdded;

    return Object.assign({}, prev, {
      products: [newProduct, ...prev.products]
    });
  }
});
