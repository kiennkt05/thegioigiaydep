const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserModel = require('../Models/user.model')



const JWT_SECRET = process.env.SECREAT_KEY;


const registerUser = async (req, res) => {
    const { name, age, email, password } = req.body;

    try {
       
        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists. Please log in instead.',
            });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10)

       
        const newUser = new UserModel({
            name,
            age,
            email,
            password: hashedPassword, 
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
        })

    } catch (error) {
        res.status(500).json({
            message: 'Registration failed. Please try again.',
            error: error.message,
        });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid email',
            });
        }

       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect password',
            });
        }

        
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'User logged in successfully',
            token: token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Login failed. Please try again.',
            error: error.message,
        });
    }
};

module.exports = { registerUser, loginUser };
