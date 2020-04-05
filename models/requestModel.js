const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
    {
        createDate: {
            type: Date,
            default: Date.now(),
            required: true,
        },
        date: {
            type: Date,
            required: [true, 'Please enter a date for session request'],
            validate: {
                validator: function (value) {
                    return value > Date.now();
                },
                message: 'Session date cannot be a past date.',
            },
        },
        accepted: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        sentTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'specify the person you want to send request'],
        },
        message: String,
    },
    {
        toObject: { virtual: true },
        toJSON: { virtual: true },
    }
);

// requestSchema.pre('save', function(next){
//     next();
// })

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
