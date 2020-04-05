const express = require('express');
const router = express.Router();
const sessionController = require('./../controllers/sessionController');
const authController = require('./../controllers/authController');

router.use(authController.isLoggedIn);

router
    .route('/')
    .get(sessionController.getSessions)
    .post(
        authController.restrictedTo('trainer'),
        sessionController.createSession
    );

router
    .route('/:id')
    .get(sessionController.getSession)
    .patch(
        authController.restrictedTo('trainer'),
        sessionController.updateSession
    )
    .delete(
        authController.restrictedTo('trainer'),
        sessionController.deleteSession
    );

module.exports = router;
