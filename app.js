const {ApolloServer, gql} = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();
require('./config');

const {typeDefs} = require('./schema/schema');
const {resolvers} = require('./resolvers/resolver');

const User = require('./models/user');

const app = express();


const context = async ({req})=>{
    let currentUser;
    let auth;
    try {
         auth = await req.headers.authorization || '';
         if(auth){
             currentUser = await User.findOne({token:auth});
         }
    } catch (e) {
        throw e;
    }
     return { currentUser,auth };
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
});

server.applyMiddleware({app});
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
app.listen(process.env.PORT,()=>{
    console.log(`Listening at port ${process.env.PORT}`);
});
