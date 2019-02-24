const {gql} = require('apollo-server-express');

const typeDefs = gql`
type User{
    id: ID!
    name:String!
    password: String!
    token: String!
    posts:[Post!]
}
type Post{
    id:ID!
    title:String
    user: User!
}
input PostInput{
    title: String!
}
type Query{
    getUsers:[User!]!
    getMe: User!
    login(name:String!, password:String!): User!
    getPosts:[Post!]!
    getAllPosts:[Post!]!
}
type Mutation{
    createUser(name:String!,password:String!): User!
    createPost(postInput:PostInput):Post!
}
`;


module.exports = {typeDefs};