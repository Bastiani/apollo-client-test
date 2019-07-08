import { gql } from "apollo-boost";

export const query = gql`
  {
    products {
      id
      description
      price
    }
  }
`;

export const subscription = gql`
  subscription ProductAdded {
    productAdded {
      id
      description
      price
    }
  }
`;
