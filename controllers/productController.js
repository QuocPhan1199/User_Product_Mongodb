const Product = require('./../models/products');
exports.createProduct = async(req, res, next)=>{
    try {
        const product = await Product.create({
            name: req.body.name,
            price:req.body.price, 
            amount:req.body.amount, 
            description:req.body.description, 
            created_by:req.user.id, 
        });
        //  console.log(product);
        const User_product = await Product.find(product._id).populate('created_by')
        res.status(200).json({
            status:"true",
            data:{
                User_product,
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getProduct =function(req, res){
    try {
        Product.find({},async function(err, product){
            if(err)
                return next(err);
            const User_product = await Product.find().populate('created_by')    
            res.send(User_product);  
        });
    } catch (error) {
        next(error);
    }
};

exports.getProductId = (req, res) => {

    Product.findById(req.params.id).then(data => {
            if(!data){
                res.status(404).send({
                    success:false,
                    message:"Khong co trong data" + req.params.id
                });
            }
            res.send({
                success:true,
                message:"OK Men",
                data: data
            });
        }).catch(err=>{
            if(err.kind ==='ObjectId'){
                return res.send({
                    success:false,
                    message:"Loi" + req.params.id
                });
            }
            return res.status(500).send({
                success:false,
                message:"Loi" + req.params.id
            });
        });
};

exports.updateProduct = (req, res) => {
    Product.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {new: true})
        .then(data => {
            if(!data) {
                return res.status(404).send({
                    success: false,
                    message: "Product not found with id " + req.params.id
                });
            }
            res.send({
                success: true,
                data: data
            });
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                success: false,
                message: "Product not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            success: false,
            message: "Error updating product with id " + req.params.id
        });
    });
};

exports.deleteProduct = (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    success: false,
                    message: "Product not found with id " + req.params.id
                });
            }
            res.send({
                success: true,
                message: "Product successfully deleted!"
            });
        }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                success: false,
                message: "Product not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            success: false,
            message: "Could not delete product with id " + req.params.id
        });
    });
};