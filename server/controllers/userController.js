const User = require('../models/User');
const Cart = require('../models/Cart');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType},
      process.env.JWT_SECRET || '2XemIAB1nT7KiU/huqFzkG6SzHDrzkG9KISJFC08RJI=',
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.createUser = async (req, res) => {
    const { email, firstName, lastName, mobile, password, userType } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            email,
            firstName,
            lastName,
            mobile,
            password,
            userType: userType || 'customer'
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const cart = new Cart({
            email: user.email,
            cartActive: true,
        });

        await cart.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email, userType: user.userType },
            process.env.JWT_SECRET || '2XemIAB1nT7KiU/huqFzkG6SzHDrzkG9KISJFC08RJI=',
            { expiresIn: '1h' }
        );

        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                mobile: user.mobile,
                userType: user.userType
            },
            token,
            message: 'User created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateUserByEmail = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteUserByEmail = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ email: req.params.email });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};
