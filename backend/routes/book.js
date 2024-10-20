const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const sharpTest = require('../middleware/sharp-config')

const multer = require('../middleware/multer-config')

const bookCtrl = require('../controllers/book');

router.post('/', auth, multer, sharpTest, bookCtrl.createBook);
router.put('/:id', auth, multer, sharpTest, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.ratingBook);
router.get('/bestrating', bookCtrl.getBestRatedBooks);
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllStuff);

module.exports = router;