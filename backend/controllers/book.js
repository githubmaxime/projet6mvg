const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = async (req, res, next) => {
    try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book ({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}_thumbnail.webp`
    });

    await book.save()

    res.status(201).json({ message: 'Objet enregistré!'});

    } catch(error) {
        res.status(400).json({ error });
    }
  };

exports.modifyBook =  (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}_thumbnail.webp`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                const filenameThumbnail = filename.split('_thumbnail.webp')[0];
                fs.unlink(`images/${filenameThumbnail}`, () => { });
                fs.unlink(`images/${filename}`, () => { });
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
Book.findOne({ _id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            const filenameThumbnail = filename.split('_thumbnail.webp')[0];
            fs.unlink(`images/${filenameThumbnail}`, () => {
            });
            fs.unlink(`images/${filename}`, () => {
                book.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'objet supprimé'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    })
};

exports.getOneBook = (req, res, next) => {
Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getBestRatedBooks = (req, res, next) => {
Book.find()
    .then(books => {
        books.sort((a, b) => b.averageRating - a.averageRating);
        const bestRatedBooks = books.slice(0, 3);
        res.status(200).json(bestRatedBooks)})
    .catch(error => res.status(404).json({ error }));
};

exports.ratingBook = async (req, res, next) => {
Book.findOne({ _id: req.params.id })
    .then( book => {    
        const isAlreadyRated = book.ratings.find((book) => book.userId === req.auth.userId);
          if ( !isAlreadyRated) {
            book.ratings.push({
                userId: req.auth.userId,
                grade: req.body.rating
            })
            let newAverageRating = book.ratings.reduce((accumulator, currentValue) => accumulator + currentValue.grade, 0)/book.ratings.length;
            book.averageRating = newAverageRating;

            return book.save()
            } else {
                res.status(401).json({message: 'Book already rated'});
            }
        })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(500).json({ error }));
  };