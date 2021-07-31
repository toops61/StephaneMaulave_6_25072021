const Sauce = require('../models/sauceModel');
const fs = require('fs');
//const { json } = require('body-parser');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
  };

exports.getOneSauce = (req, res, next) => {
Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.likeOneSauce = (req, res, next) => {
    let clicLike = req.body.like;
    let sauceId = req.params.id;
    let userId = req.body.userId;
    if (clicLike === -1) {
        Sauce.findOne({ _id: sauceId })
            .then(sauce => {
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, { 
                        $inc: { dislikes: 1 },
                        $inc: { likes: -1 },
                        $push: { usersDisliked: userId },
                        $pull: { usersLiked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'Vous n\'aimez pas cette sauce' }))
                        .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(userId)) {
                    console.log('vous avez déjà disliké');
                } else {
                    Sauce.updateOne({ _id: sauceId }, { 
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'Vous n\'aimez pas cette sauce' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(404).json({ error }));
    } else if (clicLike === 0) {
        Sauce.findOne({ _id: sauceId })
            .then(sauce => {
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, { 
                        $inc: { likes: -1 },
                        $pull: { usersLiked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'Sauce likée' }))
                        .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, { 
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'Sauce likée' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(404).json({ error }));
    } else {
        Sauce.findOne({ _id: sauceId })
            .then(sauce => {
                if (sauce.usersLiked.includes(userId)) {
                    console.log('vous avez déjà liké cette sauce');
                } else if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, { 
                        $inc: { likes: 1 },
                        $inc: { dislikes: -1 },
                        $push: { usersLiked: userId },
                        $pull: { usersDisliked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'Vous avez liké cette sauce' }))
                        .catch(error => res.status(400).json({ error }));
                } else {
                    Sauce.updateOne({ _id: sauceId }, {
                        $inc: { likes: 1 },
                        $push: { usersLiked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'Vous avez liké cette sauce' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(404).json({ error }));
    }
}
/*
likes = [usersLiked].length && dislikes = [usersDisliked].length
$size : Selects documents if the array field is a specified size.
$in : Matches any of the values specified in an array.
$nin : Matches none of the values specified in an array.
$ : Projects the first element in an array that matches the query condition
$eq : Matches values that are equal to a specified value.

Logique version 2 :
chaque clic = mise à jour !


*/