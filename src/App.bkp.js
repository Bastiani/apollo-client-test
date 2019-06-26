/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useTransition, animated } from "react-spring";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import logo from "./logo.svg";
import "./App.css";

const query = gql`
  {
    odds {
      id
      price
      availability
      matchId
      marketId
      outcomeId
      outcome
      outcomeLabel
    }
  }
`;

const subscription = gql`
  subscription OddPrice {
    OddPrice {
      id
      price
    }
  }
`;

const OddListView = ({ data, subscribeToMore }) => {
  const [toggle, set] = useState(false);
  useEffect(() => subscribeToMore(), []);
  useEffect(() => set(!toggle), [data]);

  const transitions = useTransition(toggle, null, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  return (
    data &&
    data.odds &&
    data.odds.map(odd => (
      <div key={odd.id}>
        <p>
          {odd.outcomeLabel} -
          {transitions.map(({ item, props, key }) => (
            <animated.div key={key} style={props}>
              {odd.price}
            </animated.div>
          ))}
        </p>
      </div>
    ))
  );
};

const OddList = ({ query }) => (
  <Query query={query}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error.message}</p>;
      const more = () =>
        subscribeToMore({
          document: subscription,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;

            return Object.assign({}, prev, {
              odds: prev.odds.map(odd => {
                const oddUpdate = subscriptionData.data.OddPrice.id === odd.id;
                return {
                  ...odd,
                  price: oddUpdate
                    ? subscriptionData.data.OddPrice.price
                    : odd.price
                };
              })
            });
          }
        });
      return <OddListView data={data} subscribeToMore={more} />;
    }}
  </Query>
);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <OddList query={query} />
        </p>
      </header>
    </div>
  );
}

export default App;
