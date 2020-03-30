const mongoose = require('mongoose');
const User = require('./userModel');

const sessionSchema = mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Please enter the session date'],
        validate: {
            validator: function(value) {
                return value >= Date.now();
            },
            message: 'Enter a session date for further time.'
        }
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Every session have to have a Trainer'],
        validate: {
            // Refactor this part later!
            validator: async function(value) {
                const trainer = await User.findById(value);
                return trainer.role === 'trainer';
            },
            message: 'Please select a trainer!'
        }
    },
    trainee: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Every session have to have a Trainee'],
            validate: {
                // Refactor this part later!
                validator: async function(value) {
                    const trainee = await User.findById(value);
                    return trainee.role === 'trainee';
                },
                message: 'Please select a trainee!'
            }
        }
    ]
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
