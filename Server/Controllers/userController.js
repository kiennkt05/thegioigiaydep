const asyncHandler = require('express-async-handler');
const userService = require('../Services/userService');

const registerUser = asyncHandler(async (req, res) => {
    const result = await userService.register(req.body);
    res.status(201).json({
        message: 'User registered successfully',
        user: result,
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await userService.login(email, password);

    res.status(200).json({
        message: 'User logged in successfully',
        ...result
    });
});

const refreshToken = asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        res.status(401);
        throw new Error('Refresh token is required');
    }
    const result = await userService.refresh(token);
    res.status(200).json(result);
});

module.exports = { registerUser, loginUser, refreshToken };
