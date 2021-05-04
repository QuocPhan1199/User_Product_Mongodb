const mongoose = require('mongoose');
const User = require('./user');
const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Vui long nhap ten san pham"],
    },
    price:{
        type: Number,
        required: [true,"Vui long dien gia san pham"],
    },
    amount:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: [true,"Vui long nhap thong tin san pham"],
    },
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    created_at:{
        type: Date,
        default: Date.now,
    },
    updated_at:{
        type: Date,
        default: Date.now,
    },
});


const Product = mongoose.model('Product',productSchema);
module.exports = Product;
// async function getProduct(){
   
// }
// getProduct();