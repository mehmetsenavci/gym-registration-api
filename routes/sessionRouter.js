const express = require('express');
const router = express.Router();
const sessionController = require('./../controllers/sessionController');

router
    .route('/')
    .get(sessionController.getSessions)
    .post(sessionController.createSession);

router
    .route('/:id')
    .get(sessionController.getSession)
    .patch(sessionController.updateSession)
    .delete(sessionController.deleteSession);

module.exports = router;
