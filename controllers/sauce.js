const Sauce = require('../models/sauceModel');
const fs = require('fs');

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Nouvelle sauce créée !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res) => {
    const sauceId = req.params.id;
    if (req.file) {
        Sauce.findOne({ _id: sauceId})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, (err) => {
                if (err) throw err;
            });
        })
        .catch(error => res.status(500).json({ error }));
        var sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`};
    } else {
        var sauceObject = { ...req.body };
    };
    Sauce.updateOne({ _id: sauceId }, { ...sauceObject, _id: sauceId })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res) => {
    const sauceId = req.params.id;
    Sauce.findOne({ _id: sauceId})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: sauceId })
                .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
  };

exports.getOneSauce = (req, res) => {
Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.likeOneSauce = (req, res) => {
    let clicLike = req.body.like;
    let sauceId = req.params.id;
    let userId = req.body.userId;
    if (clicLike === -1) {
        Sauce.updateOne({ _id: sauceId }, { 
            $inc: { dislikes: 1 },
            $push: { usersDisliked: userId }
        })
            .then(() => res.status(200).json({ message: 'Vous n\'aimez pas cette sauce' }))
            .catch(error => res.status(400).json({ error }));
    } else if (clicLike === 1) {
        Sauce.updateOne({ _id: sauceId }, {
            $inc: { likes: 1 },
            $push: { usersLiked: userId }
        })
            .then(() => res.status(200).json({ message: 'Vous aimez cette sauce' }))
            .catch(error => res.status(400).json({ error }));   
    } else {
        Sauce.findOne({ _id: sauceId })
            .then(sauce => {
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, { 
                        $inc: { likes: -1 },
                        $pull: { usersLiked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'Vous avez annulé votre choix' }))
                        .catch(error => res.status(400).json({ error }));
                } else {
                    Sauce.updateOne({ _id: sauceId }, { 
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'Vous avez annulé votre choix' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(404).json({ error }));
    } 
}