const Request = require('./../models/requestModel');

module.exports = {
    createRequest: async (req, res) => {
        try {
            const request = await Request.create(req.body);
            res.status(201).json({
                status: 'success',
                data: {
                    request,
                },
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: err,
            });
        }
    },
    getRequests: async (req, res) => {
        try {
            const requests = await Request.find().populate('sentTo createdBy');
            res.status(200).json({
                status: 'success',
                results: requests.length,
                data: {
                    requests,
                },
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: err,
            });
        }
    },
    getRequest: async (req, res) => {
        try {
            const request = await Request.findById(req.params.id);
            res.status(200).json({
                status: 'success',
                data: {
                    request,
                },
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: err,
            });
        }
    },
    updateRequest: async (req, res) => {
        try {
            const updatedRequest = await Request.findByIdAndUpdate(
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
                    request: updatedRequest,
                },
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: err,
            });
        }
    },
    deleteRequest: async (req, res) => {
        try {
            await Request.findByIdAndRemove(req.params.id);
            res.status(200).json({
                status: 'success',
                data: null,
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: err,
            });
        }
    },
    createRequestForLoggedInUser: async (req, res) => {
        try {
            const request = await Request.create({
                date: req.body.date,
                sentTo: req.body.sentTo,
                createdBy: req.loggedIn._id,
            });
            res.status(201).json({
                status: 'success',
                data: {
                    request,
                },
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: err,
            });
        }
    },
    getRequestsForLoggedInUser: async (req, res) => {
        try {
            const recivedRequestForUser = await Request.find({
                $or: [
                    { sentTo: req.loggedIn._id },
                    { createdBy: req.loggedIn._id },
                ],
            }).populate('sentTo createdBy');
            res.status(200).json({
                status: 'success',
                data: {
                    request: recivedRequestForUser,
                },
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: err,
            });
        }
    },
};
