const Request = require('./../models/requestModel');
const promiseCatch = require('./../utils/promiseCatch');
const APIError = require('./../utils/apiError');

module.exports = {
    createRequest: promiseCatch(async (req, res) => {
        const request = await Request.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                request,
            },
        });
    }),
    getRequests: promiseCatch(async (req, res) => {
        const requests = await Request.find().populate('sentTo createdBy');
        res.status(200).json({
            status: 'success',
            results: requests.length,
            data: {
                requests,
            },
        });
    }),
    getRequest: promiseCatch(async (req, res) => {
        const request = await Request.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                request,
            },
        });
    }),
    updateRequest: promiseCatch(async (req, res) => {
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
    }),
    deleteRequest: promiseCatch(async (req, res) => {
        await Request.findByIdAndRemove(req.params.id);
        res.status(200).json({
            status: 'success',
            data: null,
        });
    }),
    createRequestForLoggedInUser: promiseCatch(async (req, res) => {
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
    }),
    getRequestsForLoggedInUser: promiseCatch(async (req, res) => {
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
    }),
};
