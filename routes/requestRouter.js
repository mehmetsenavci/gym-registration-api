const express = require('express');
const router = express.Router();
const requestController = require('./../controllers/requestController');
const authController = require('./../controllers/authController');

router.use(authController.isLoggedIn);

router.route('/inbox').get(requestController.getRequestsForLoggedInUser);
router
    .route('/sendRequest')
    .post(requestController.createRequestForLoggedInUser);

router.use(authController.restrictedTo('admin'));
router
    .route('/')
    .post(requestController.createRequest)
    .get(requestController.getRequests);

router
    .route('/:id')
    .get(requestController.getRequest)
    .patch(requestController.updateRequest)
    .delete(requestController.deleteRequest);

module.exports = router;
