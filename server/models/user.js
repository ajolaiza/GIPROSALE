const mongoose=require('mongoose');

const bcrypt=require('bcrypt');//for password encrytion hashing
const jwt=require('jsonwebtoken');
const SALT_I=10;
require('dotenv').config()

const userSchema=mongoose.Schema({
email:{
    type:String,
    required:true, //require everytime
    trim:true,//dont store whitespace
    unique:1 //emails must be unique
},
password:{
    type:String,
    required:true,
    minlength:5
},
name:{
    type:String,
    required:true,
    maxlength:60
},
cart:{
    type:Array,
    default:[]

},
history:{
    type:Array,
    default:[]
},
//user need role after registers
role:{
    type:Number, //can use   srtring number or boolean .we have user and afmin only
    default:0  //admin rights
},
token:{
    type: String
}


});
//before saving password run the following line .save is declared in server.js
userSchema.pre('save',function(next){  //after hashing we use next
var user=this; // makin reference to userSchema not function(next)

if(user.isModified('password')){
    bcrypt.genSalt(SALT_I,function(err,salt){
        if(err) return next(err)
        bcrypt.hash(user.password,salt,function(err,hash){
            if (err) return next(err);
            user.password=hash;
            next();
    
        });
    })
    
}else{
    next()
}
})
userSchema.methods.comparePassword=function(candidatePassword,cb){
 bcrypt.compare(candidatePassword,this.password,function(err,isMatch){

    if (err) 
    return cb(err);
    cb(null,isMatch)
 })
    

}
userSchema.methods.generateToken= function(cb){
    var user=this;
    var token=jwt.sign(user._id.toHexString(),process.env.SECRET) //generate token
    user.token=token;
    user.save(function(err,user){
       if (err) return cb(err) 
       cb(null,user);

    })
    ///user.id+password


}
userSchema.statics.findByToken=function(token,cb){
    var user =this; 
    jwt.verify(token,process.env.SECRET,function(err,decode){
        user.findOne({"_id":decode,"token":token},function(err,user){
            if(err)return cb(err);
            cb(null,user)
        })
    })



}



//for export to server we use object above 
const User=mongoose.model('User',userSchema);
 module.exports={User}