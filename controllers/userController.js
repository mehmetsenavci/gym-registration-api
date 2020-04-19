const User = require('./../models/userModel');
const promiseCatch = require('./../utils/promiseCatch');
const APIError = require('./../utils/apiError');

module.exports = {
    createUser: promiseCatch(async (req, res, next) => {
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
    }),
    getAllUsers: promiseCatch(async (req, res, next) => {
        const exclude = ['sort', 'page', 'limit', 'fields'];
        const queryObj = { ...req.query };

        exclude.forEach((el) => delete queryObj[el]);
        const queryStr = JSON.stringify(queryObj).replace(
            /\b(gte|gt|lte|lt|ne)\b/g,
            (match) => `$${match}`
        );
        const filter = JSON.parse(queryStr);

        const fields = req.query.fields
            ? `${req.query.fields.split(',').join(' ')} birthDate createDate`
            : '-__v';

        const sortBy = req.query.sort
            ? req.query.sort.split(',').join(' ')
            : '-createDate';

        const page = req.query.page || 1;
        const limit = 10;
        const paginate = { skip: limit * page - limit, limit: limit };

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
    }),
    getUser: promiseCatch(async (req, res, next) => {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    }),
    updateUser: promiseCatch(async (req, res, next) => {
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
    }),
    deleteUser: promiseCatch(async (req, res, next) => {
        await User.findByIdAndRemove(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    }),
};
