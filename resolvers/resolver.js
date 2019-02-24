const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Post = require('../models/post');
const {userConstant} = require('../helpers/helper');

const resolvers = {
    Query:{
        getUsers:async (parent,args,context)=>{
            if(!context.currentUser){
                throw new Error('You must login first to get all users');
            }
            const users = await User.find();
           return users;
        },
        getMe:async (parent,args,context)=>{
         const user = context.currentUser;
         if(!user){
             throw new Error('Login now');
         }
         return {...user._doc};
        },
        login: async(parent,args,context)=>{
    
            const user = await User.findOne({name:args.name});
            if(!user){
                throw new Error('User not found');
            }
            const verifyPassword = await bcrypt.compare(args.password,user.password);
            if(!verifyPassword){
                throw new Error('Invalid password');
            }
            
            const token = await user.generateToken();
            return {...user._doc,token: token}
        },
        getPosts: async(parent,args,context)=>{
           if(!context.currentUser){
               throw new Error('Login first to get all posts');
           }
           const posts = await Post.find({user:context.currentUser.id});
           return posts.map((post)=>{
               return {
                   ...post._doc,
                   user:context.currentUser}
           }); 
        },
        getAllPosts:async()=>{
           const posts = await Post.find();
           return posts.map((post)=>{
    
               return {
                   ...post._doc,
                   id:post.id,
                   user:userConstant.bind(this,post._doc.user)
               };
           });
    
        }
    
    },
    Mutation:{
        createUser: async (parent,args)=>{
         const hashPassword = await bcrypt.hash(args.password,12);
 
         const user = new User({
             name : args.name,
             password : hashPassword
         });
        const savedUser =  await user.save();
        return {...savedUser._doc,password: savedUser.password,id: savedUser._id};
     },
     createPost: async(parent,args,context)=>{
         if(!context.currentUser){
             throw new Error('Login first in order to post');
         }
 
         const post = new Post({
             title: args.postInput.title,
             user : context.currentUser.id
         });
 
         const savedPost = await post.save();
         context.currentUser.posts.push(savedPost);
         await context.currentUser.save();
         return {
             ...savedPost._doc,
             id: savedPost.id,
             user:context.currentUser
         };
     }}
 
}

module.exports = {resolvers};