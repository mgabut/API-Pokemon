const { Pokemon } = require('../db/sequelize')
const { Op } = require('sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
  app.get('/api/pokemons', auth, (req, res) => {

    const limit = parseInt(req.query.limit) || 5
    if (req.query.name){
      const name = req.query.name

      if(name.length < 2){
        const message = 'Le terme de recherche doit contenir a moins 2 caracteres'
        return res.status(400).json({message})
      }

      return Pokemon.findAndCountAll({ //retourne la data en nbre limité avec le compte total
        where : {
          name: { //name est la ppté du modele pokemon
            [Op.like]: `%${name}%` //name est le critère de la recherche 
          }
        },
        order: ['name'],
        limit : limit
      })
      .then(({count, rows}) => { 
        const message = `Il y a ${count} pokemons qui correspondent au terme de recherche ${name}`
        res.json({message, data: rows})
      })
    }
    else{
    Pokemon.findAll({order: ['name'], limit : limit})
      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.'
        res.json({ message, data: pokemons })
      })
      .catch(error => {
        const message = 'La liste des pokemons n\'a pas pu etre récupérée, Réessayez dans quelques instants'
        res.status(500).json({message, data: error})
      })
    }
  })
}