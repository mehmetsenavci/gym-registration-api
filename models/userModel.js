const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        require: [true, 'Please enter your email']
    },
    password: {
        type: String,
        require: [true, 'Please enter your password.']
    },
    role: {
        type: String,
        default: 'Trainee',
        enum: ['Trainer', 'Trainee']
    },
    birthDate: {
        type: Date,
        require: [true, 'Please enter your birth date.']
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
