import React from "react";
import { Query } from "react-apollo";

export default function createQueryRenderer(FragmentComponent, config) {
  const { query, subscription, updateQuery, queriesParams } = config;

  class QueryRendererWrapper extends React.Component {
    render() {
      const variables = queriesParams
        ? queriesParams(this.props)
        : config.variables;

      return (
        <Query query={query} variables={variables}>
          {({ loading, error, data, subscribeToMore }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            const more =
              subscription &&
              (() =>
                subscribeToMore({
                  document: subscription,
                  updateQuery
                }));
            return <FragmentComponent data={data} subscribeToMore={more} />;
          }}
        </Query>
      );
    }
  }

  return QueryRendererWrapper;
}
