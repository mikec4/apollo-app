const User = require('../models/user');
const Post = require('../models/post');


const userConstant = async id=>{
    const user = await User.findById(id);
    return {
        ...user._doc,
        id: user.id,
        posts: postsConstant.bind(this,user._doc.posts)
    }
}
const postsConstant = async ids=>{
    const posts = await Post.find({_id:{$in:ids}});
    return posts.map((post)=>{
        return {
            ...post._doc,
            id: post.id,
            user: userConstant.bind(this,post._doc.user)
        }
    });
}
module.exports={userConstant,postsConstant};