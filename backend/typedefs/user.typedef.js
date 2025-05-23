// backend/typedefs/user.typedef.js

const userTypeDef = `#graphql
type User {
    _id: ID!
    username: String!
    name: String!
    password: String!
    profilePicture: String
    gender: String!
    transactions:[Transaction]
}
type Query {
    authUser: User
    user(userId: ID): User
}
type Mutation {
    signup(input: signUpInput!): User
    Login(input: LoginInput!): User
    logout: LogoutResponse
}
input signUpInput {
    username: String!
    name: String!
    password: String!
    gender: String!
}
input LoginInput {
    username: String!
    password: String!
}
type LogoutResponse {
    message: String!
}
`;

export default userTypeDef;
