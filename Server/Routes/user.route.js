const express = require('express');
const { registerUser, loginUser, refreshToken } = require('../Controllers/userController');
const validateRequest = require('../Middlewares/validateMiddleware');
const { userRegisterSchema, userLoginSchema } = require('../Validators/schemas');

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

const userRouter = express.Router();

userRouter.post('/register', authLimiter, validateRequest(userRegisterSchema), registerUser);
userRouter.post('/login', authLimiter, validateRequest(userLoginSchema), loginUser);
userRouter.post('/refresh-token', refreshToken);

module.exports = userRouter;
