const {ApolloServer, gql,graphiqlExpress,graphqlExpress} = require('apollo-server-express');
const {makeExecutableSchema} = require('graphql-tools');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
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
    context,
    introspection:true,
    playground:true
});

server.applyMiddleware({app});
// const schema = makeExecutableSchema({
// typeDefs,
// resolvers,
// context
// });
//app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
//app.use('/', graphiqlExpress({ endpointURL: '/graphql' }));
app.use(bodyParser.json());
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
app.listen(process.env.PORT,()=>{
    console.log(`Listening at port ${process.env.PORT}`);
});
