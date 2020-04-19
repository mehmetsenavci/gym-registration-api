const Session = require('./../models/sessionModel');
const promiseCatch = require('./../utils/promiseCatch');
const APIError = require('./../utils/apiError');

module.exports = {
    createSession: promiseCatch(async (req, res, next) => {
        // Validation problem
        const newSession = await Session.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                newSession,
            },
        });
    }),
    getSessions: promiseCatch(async (req, res, next) => {
        const sessions = await Session.find();

        res.status(200).json({
            status: 'success',
            data: {
                sessions,
            },
        });
    }),
    getSession: promiseCatch(async (req, res, next) => {
        const session = await Session.findById(req.params.id).populate(
            'trainer trainee'
        );

        res.status(200).json({
            status: 'success',
            data: {
                session,
            },
        });
    }),
    updateSession: promiseCatch(async (req, res, next) => {
        const updatedSession = await Session.findByIdAndUpdate(
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
                updatedSession,
            },
        });
    }),
    deleteSession: promiseCatch(async (req, res, next) => {
        await Session.findByIdAndRemove(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null,
        });
    }),
};
