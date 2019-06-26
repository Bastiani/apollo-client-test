/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useTransition, animated } from "react-spring";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import logo from "./logo.svg";
import "./App.css";

const query = gql`
  {
    products {
      id
      description
      price
    }
  }
`;

const subscription = gql`
  subscription ProductAdded {
    productAdded {
      id
      description
      price
    }
  }
`;

const ProductListView = ({ data, subscribeToMore }) => {
  useEffect(() => subscribeToMore(), []);
  console.log("====== ProductListView", data);

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

const ProductList = ({ query }) => (
  <Query query={query}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error.message}</p>;
      const more = () =>
        subscribeToMore({
          document: subscription,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            console.log("=== prev.products", prev);
            console.log(
              "===== subscriptionData.data.productAdded",
              subscriptionData.data.productAdded
            );

            const newProduct = subscriptionData.data.productAdded;

            return Object.assign({}, prev, {
              products: [newProduct, ...prev.products]
            });
          }
        });
      return <ProductListView data={data} subscribeToMore={more} />;
    }}
  </Query>
);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <ProductList query={query} />
        </p>
      </header>
    </div>
  );
}

export default App;
