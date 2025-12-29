const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/user.model');

const JWT_SECRET = process.env.SECREAT_KEY;

const register = async (userData) => {
    const { name, phoneNumber, email, password } = userData;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        throw new Error('User already exists. Please log in instead.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
        name,
        phoneNumber,
        email,
        password: hashedPassword,
    });

    await newUser.save();
    return { id: newUser._id, name: newUser.name, email: newUser.email, phoneNumber: newUser.phoneNumber };
};

const login = async (email, password) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const accessToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save();

    return {
        accessToken,
        refreshToken,
        user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber }
    };
};

const refresh = async (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserModel.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            throw new Error('Invalid refresh token');
        }

        const accessToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        user.refreshToken = newRefreshToken;
        await user.save();

        return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
        throw new Error('Token refresh failed');
    }
};

module.exports = { register, login, refresh };
