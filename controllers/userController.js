const User = require('./../models/userModel');

exports.createUser = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            birthDate: req.body.birthDate
        });
        res.status(201).json({
            status: 'success',
            data: {
                newUser
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err
        });
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err
        });
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err
        });
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        res.status(200).json({
            status: 'success',
            data: updatedUser
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err
        });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndRemove(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err
        });
    }
};
