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
    console.log(clicLike);
    let userId = req.params.id;
    if (clicLike === -1) {
        Sauce.findOne({ _id: userId })
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({ _id: userId }, { 
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
                    Sauce.updateOne({ _id: userId }, { 
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'Vous n\'aimez pas cette sauce' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(404).json({ error }));
    } else if (clicLike === 0) {
        Sauce.findOne({ _id: userId })
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({ _id: userId }, { 
                        $inc: { likes: -1 },
                        $pull: { usersLiked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'Sauce likée' }))
                        .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({ _id: userId }, { 
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'Sauce likée' }))
                        .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(404).json({ error }));
    } else if (clicLike === 1) {
        Sauce.findOne({ _id: userId })
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) {
                    console.log('vous avez déjà liké cette sauce');
                } else if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({ _id: userId }, { 
                        $inc: { likes: 1 },
                        $inc: { dislikes: -1 },
                        $push: { usersLiked: userId },
                        $pull: { usersDisliked: userId }
                    })
                        .then(() => res.status(200).json({ message: 'Vous avez liké cette sauce' }))
                        .catch(error => res.status(400).json({ error }));
                } else {
                    Sauce.updateOne({ _id: userId }, {
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
//Définit le statut "j'aime" pour userID fourni. Si j'aime = 1, l'utilisateur aime la sauce. Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas. Si j'aime = -1, l'utilisateur n'aime pas la sauce. L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié, en gardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois. Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime".

/* 
userId / _id (sauce ID) / cliclike / {likes, dislikes, [usersLiked], [usersDislikes]}
clicLike = -1 ou 0 ou 1
Si j'aime (clicLike) = -1 : il avait déjà liké (appartient à [usersLiked]) => retire userId de [usersLiked], ajoute à [usersDisliked]
                                            ou disliké (appartient à [usersDisliked]) => rien
                                            ou rien (appartient à aucun) => ajoute à [userDisliked] et dislikes ++
Si j'aime (clicLike) = 0 : il avait déjà liké (appartient à [usersLiked]) => retire userId de [usersLiked]
                                            ou disliké (appartient à [usersDisliked]) => retire userId de [userDisliked]
                                            ou rien (appartient à aucun) => rien
Si j'aime (clicLike) = 1 : il avait déjà liké (appartient à [usersLiked]) => rien
                                            ou disliké (appartient à [usersDisliked]) => retire userID de [usersDisliked] et ajoute à [usersLiked]
                                            ou rien (appartient à aucun) => ajoute à [userLiked]


likes = [usersLiked].length && dislikes = [usersDisliked].length
$size : Selects documents if the array field is a specified size.
$in : Matches any of the values specified in an array.
$nin : Matches none of the values specified in an array.
$ : Projects the first element in an array that matches the query condition
$eq : Matches values that are equal to a specified value.

Logique version 2 :
chaque clic = mise à jour !


*/