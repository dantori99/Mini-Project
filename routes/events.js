const express = require('express');

const { retrieveAllEvent, retrieveDetailEvent, createEvent, updateEvent, deleteEvent, retrieveMyEvent } = require('../controllers/events');

const {
    isLogged
} = require('../middlewares/auth')

const { eventValidator } = require('../middlewares/validators/events')

const router = express.Router();

router.get('/', retrieveAllEvent);
router.get('/myEvent', retrieveMyEvent);
router.get('/:id', isLogged, retrieveDetailEvent);
router.post('/', isLogged, eventValidator, createEvent);
router.put('/:id', isLogged, eventValidator, updateEvent);
router.delete('/:id', isLogged, deleteEvent);

module.exports = router;