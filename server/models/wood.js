const mongoose = require('mongoose');
console.log("d,mvndskvjn");
const woodSchema=mongoose.Schema({
    name:{
        required:true,
        type:String,
        unique:1,
        maxlength:100

    }
})
const Wood= mongoose.model('Wood',woodSchema);
module.exports={Wood}
