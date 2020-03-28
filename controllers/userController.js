const User = require('./../models/userModel');

exports.createUser = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            birthDate: req.body.birthDate
        });
        res.status(200).json({
            status: 'success',
            data: {
                newUser
            }
        });
    } catch (err) {
        console.log(err);
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
        console.log(err);
    }
};

exports.getUser = (req, res, next) => {
    try {
        res.status(200).json({
            name: 'Mehmet',
            birthDate: '12.12.1998'
        });
        console.log(req.params);
    } catch (err) {}
};

exports.updateUser = (req, res, next) => {
    try {
        res.status(200).json({
            name: 'Mehmet',
            birthDate: '12.12.1998'
        });
        console.log(req.params);
    } catch (err) {}
};

exports.deleteUser = (req, res, next) => {
    try {
        res.status(200).json({
            name: 'Mehmet',
            birthDate: '12.12.1998'
        });
        console.log(req.params);
    } catch (err) {}
};
