const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, Controller.register);
router.get('/list', Controller.list);
router.get('/detailsById/:id', Controller.detailsById);
router.post('/update', authentification, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.post('/searchLoker', Controller.searchLoker);

module.exports = router
