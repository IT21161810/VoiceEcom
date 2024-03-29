import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cartSchema = new Schema({

    resturant:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    dish:{
        type:String,
        required:true
    },
    rating:{
        type:String,
        required:true
    },
    review:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },

})

export default mongoose.model("Cart",cartSchema);