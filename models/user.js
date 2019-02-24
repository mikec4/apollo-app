const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = Schema({
    name:{
        type :String,
        require: true
    },
    password:{
        type:String,
        required: true
    },
    token:{
        type:String
    },
    posts:[
        {
            type:Schema.Types.ObjectId, 
            ref : 'Post'
        }
    ]
  
});

userSchema.methods.generateToken= async function(){
    user = this;
    const token = jwt.sign({id: user.id,name:user.name},process.env.APP_SECRET);
    user.token = token;
    await user.save();
    return token;
};
userSchema.statics.findUserByToken = async function(token){
    User = this;
    var  user;
    try {
     user = await User.findOne({token: token});
    } catch (e) {
        throw e;
    }
    return user;
    
}
module.exports = mongoose.model('User',userSchema);