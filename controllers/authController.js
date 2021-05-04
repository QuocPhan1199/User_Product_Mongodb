const User = require('../models/user');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');

//Tạo token theo id của user
const createToken = id =>{
    return jwt.sign({
        id,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
    );
};
exports.signup = async (req, res, next) => {
    try {
        const user = await User.create({ // Tạo một user
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
        });
        const token = createToken(user.id);  // Tạo token cho user đó
        user.password = undefined; // trả mật khẩu về null
        res.status(201).json({ // respon lại kết quả nếu ok
            status:"success", // thông báo
            token, // hiển thị token
            data: { // dữ liệu của user
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

// đăng nhập
exports.login = async (req, res, next)=>{
    try {
        const { email, password } = req.body; // lấy email và password từ body
        if(!email || !password){ // validate mật khẩu và pass
            return next(
                new AppError(404,"Lam on dien dung email and password"),
                req,res, next,
            );
        }
        const user = await User.findOne({ //lấy một user kiểm tra
            email,
        }).select("+password");
        if(!user || !(await user.correctPassword(password, user.password))){ // kiểm tra 
            return next(
                new AppError(401,"fail","Email and password is wrong"),
                req, res, next,
            );
        }
        //   console.log(user); // kiem tra id cua user
        const token = createToken(user.id); // refersh token khi đăng nhap
        user.password = undefined; // password trả về null
        res.status(200).json({
            status:"success",
            token,
            data:{
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.protect = async (req, res, next)=>{ 
    try {
        
        // Kiểm tra token có tồn tại ko
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
        {
            token = req.headers.authorization.split(" ")[1];
        }
        if(!token) // Không tồn tại thì thong báo
        {
            return next(
                new AppError(401, "fail", "Ban chua dang nhap! Vui long dang nhap lai"),
                req, res, next,
            );
        }
         const user = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        // Xác minh token
        // const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // const user = await User.findById(decode.id); // kiểm tra người dùng có tồn tại ko
        if(!user)
        {
            return next(
                new AppError(401,"fail","User khong ton tai"),
                req, res, next,
            );
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
// Phan quyền
exports.restrictTo = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(
                new AppError(403,"fail","Ban khong phai la admin"),
                req, res, next,
            );
        }
        next();
    };
};
