const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter your name.'],
        },
        email: {
            type: String,
            required: [true, 'Please enter your email.'],
        },
        password: {
            type: String,
            required: [true, 'Please enter your password.'],
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password.'],
            validate: {
                validator: function (value) {
                    return value === this.password;
                },
                message: 'Passwords are different.',
            },
        },
        role: {
            type: String,
            default: 'trainee',
            enum: ['admin', 'trainer', 'trainee'],
        },
        birthDate: {
            type: Date,
            required: [true, 'Please enter your birth date.'],
        },
        createDate: {
            type: Date,
            default: Date.now(),
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.virtual('birthDateStr').get(function () {
    return this.birthDate.toDateString();
});

userSchema.virtual('createDateStr').get(function () {
    return this.createDate.toDateString() + '';
});

userSchema.virtual('age').get(function () {
    return Math.floor(
        (Date.now() - this.birthDate) / 1000 / 60 / 60 / 24 / 365
    );
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.isCorrectPassword = async function (
    enteredPassword,
    hashedPassword
) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
