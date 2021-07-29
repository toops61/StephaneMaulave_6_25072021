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
    Sauce.updateOne({ _id: req.params.id }, { 
        likes: clicLike,
        dislikes: clicLike
    })
            .then(() => res.status(200).json({ message: 'Sauce likée' }))
            .catch(error => res.status(400).json({ error }));
    };
//const likeSauce = JSON.parse(req.body.likes);
    /* Sauce.findOne({ _id: req.params.id })
        .then(() => {
            let nbrLike = req.body.like;
            res.status(200).json({ message: 'Sauce likée !'});
            console.log(nbrLike);
        })
        .catch(error => res.status(404).json({ error }));
        }; */
//Définit le statut "j'aime" pour userID fourni. Si j'aime = 1, l'utilisateur aime la sauce. Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas. Si j'aime = -1, l'utilisateur n'aime pas la sauce. L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié, en gardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois. Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime".