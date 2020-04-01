const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

exports.signup = async (req, res, next) => {
    try {
        // 1) Create user documet.
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
            birthDate: req.body.birthDate
        });
        // 2) Sign a jwt token to user.
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        // 3) Send response.
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return next(new Error('This user does not exists!'));

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.isCorrectPassword(password, user.password)))
            return next(new Error('Invalid password'));

        // console.log(user);
        // console.log({ _id: user._id });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        console.log(user);
        console.log({ _id: user._id });

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err
        });
    }
};

exports.isLoggedIn = async (req, res, next) => {
    if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
    )
        return next(new Error('Invalid autharization type'));

    const token = req.headers.authorization.split(' ')[1];

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById({ _id: decoded._id });

    if (!user) return next(new Error('User not found'));
    console.log(user);

    // Check if user changed password.

    next();
};
