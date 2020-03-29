const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password.']
        // select: false
    },
    role: {
        type: String,
        default: 'Trainee',
        enum: ['Trainer', 'Trainee']
    },
    birthDate: {
        type: Date,
        required: [true, 'Please enter your birth date.']
    },
    createDate: {
        type: Date,
        default: Date.now()
    },
    active: {
        type: Boolean,
        default: true
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
