const Session = require('./../models/sessionModel');

exports.createSession = async (req, res, next) => {
    try {
        // Validation problem
        const newSession = await Session.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                newSession
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err
        });
    }
};

exports.getSessions = async (req, res, next) => {
    const sessions = await Session.find();

    try {
        res.status(200).json({
            status: 'success',
            data: {
                sessions
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err
        });
    }
};

exports.getSession = async (req, res, next) => {
    const session = await Session.findById(req.params.id).populate(
        'trainer trainee'
    );

    try {
        res.status(200).json({
            status: 'success',
            data: {
                session
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err
        });
    }
};

exports.updateSession = async (req, res, next) => {
    const updatedSession = await Session.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );
    try {
        res.status(200).json({
            status: 'success',
            data: {
                updatedSession
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err
        });
    }
};

exports.deleteSession = async (req, res, next) => {
    await Session.findByIdAndRemove(req.params.id);
    try {
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err
        });
    }
};
