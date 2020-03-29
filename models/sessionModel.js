const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Please enter the session date']
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Every session have to have a Trainer']
    },
    trainee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Every session have to have a Trainee']
    }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
