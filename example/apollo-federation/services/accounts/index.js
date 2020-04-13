import { gql } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import { makeAugmentedSchema } from '../../../../src';

export const users = [
  {
    id: '1',
    name: 'Ada Lovelace',
    birthDate: '1815-12-10',
    username: '@ada'
  },
  {
    id: '2',
    name: 'Alan Turing',
    birthDate: '1912-06-23',
    username: '@complete'
  }
];

export const accountsSchema = buildFederatedSchema([
  makeAugmentedSchema({
    typeDefs: gql`
      extend type Query {
        me: User
      }

      type Mutation {
        CreateUser(myTime: DateTime): User
          @cypher(statement: "MATCH (u:User) RETURN u")
      }

      type User @key(fields: "id") {
        id: ID!
        name: String
        username: String
      }
    `,
    resolvers: {
      Query: {
        me() {
          return users[0];
        }
      },
      User: {
        __resolveReference(object) {
          return users.find(user => user.id === object.id);
        }
      }
    },
    config: {
      isFederated: true,
      debug: true
    }
  })
]);
