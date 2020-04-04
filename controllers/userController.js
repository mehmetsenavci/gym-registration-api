const User = require('./../models/userModel');

exports.createUser = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
            birthDate: req.body.birthDate,
        });
        res.status(201).json({
            status: 'success',
            data: {
                newUser,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err,
        });
    }
};

// Continue adding queries
exports.getAllUsers = async (req, res, next) => {
    try {
        // Transform querying functionalty to a class
        const exclude = ['sort', 'page', 'limit', 'fields'];
        const queryObj = { ...req.query };

        exclude.forEach((el) => delete queryObj[el]);
        const queryStr = JSON.stringify(queryObj).replace(
            /\b(gte|gt|lte|lt|ne)\b/g,
            (match) => `$${match}`
        );
        // Sets the field values from the req.query object and sets it to '-__v' if nothing is passed.
        const fields = req.query.fields
            ? req.query.fields.split(',').join(' ')
            : '-__v';
        // Sets the sorting values from the req.query object and sets it to '-__createDate' if nothing is passed.
        const sortBy = req.query.sort
            ? req.query.sort.split(',').join(' ')
            : '-createDate';
        // Pagination variables
        const page = req.query.page || 1;
        const limit = 10;
        const paginate = { skip: limit * page - limit, limit: limit };
        const filter = JSON.parse(queryStr);

        const query = User.find(filter, fields, paginate).sort(sortBy);
        // .skip(2 * page - 2)
        // .limit(2);

        const users = await query;

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err,
        });
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err,
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
                runValidators: true,
            }
        );
        res.status(200).json({
            status: 'success',
            data: {
                updatedUser,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err,
        });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndRemove(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err,
        });
    }
};
