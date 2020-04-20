const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const promiseCatch = require('./../utils/promiseCatch');
const APIError = require('./../utils/apiError');
const sendEmail = require('./../utils/mailer');
const crypto = require('crypto');

module.exports = {
    signup: promiseCatch(async (req, res, next) => {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
            birthDate: req.body.birthDate,
        });

        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser,
            },
        });
    }),
    login: promiseCatch(async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password)
            return next(new APIError('This user does not exists!'));

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.isCorrectPassword(password, user.password)))
            return next(new APIError('Invalid password'));

        // console.log(user);
        // console.log({ _id: user._id });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user,
            },
        });
    }),
    isLoggedIn: promiseCatch(async (req, res, next) => {
        if (
            !req.headers.authorization ||
            !req.headers.authorization.startsWith('Bearer ')
        )
            return next(new APIError('Invalid autharization type'));

        const token = req.headers.authorization.split(' ')[1];

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById({ _id: decoded._id });

        if (!user) return next(new APIError('User not found'));

        req.loggedIn = user;
        // Check if user changed password.

        next();
    }),
    forgotPassword: promiseCatch(async (req, res, next) => {
        const user = await User.findOne(req.body);
        if (!user) {
            return APIError('User does not exists!', 404);
        }
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const options = {
            email: req.body.email,
            subject: 'Password reset link is in the mail!',
            message: `${req.protocol}://${req.get(
                'host'
            )}/api/v1/users/resetPassword/${resetToken}`,
        };

        try {
            await sendEmail(options);
            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!',
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetTokenExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return next(
                new APIError(
                    'There was an error sending the email. Try again later!'
                ),
                500
            );
        }
    }),
    resetPassword: promiseCatch(async (req, res, next) => {
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return next(
                new APIError(
                    'Password reset token is not valid or it is expired',
                    400
                )
            );
        }

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;

        user.passwordChangedAt = Date.now();

        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        user.password = undefined;

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user,
            },
        });
    }),
    restrictedTo: (...roles) => {
        return (req, res, next) => {
            if (roles.includes(req.loggedIn.role)) {
                next();
            } else {
                next(new APIError('This use is unauthorized'));
            }
        };
    },
};
