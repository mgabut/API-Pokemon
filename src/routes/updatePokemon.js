const { Pokemon } = require('../db/sequelize')
const { ValidationError } = require('sequelize')
const auth = require('../auth/auth')
  
module.exports = (app) => {
  app.put('/api/pokemons/:id', auth, (req, res) => {
    const id = req.params.id
    Pokemon.update(req.body, {
      where: { id: id }
    })
    .then(_ => {
      return Pokemon.findByPk(id).then(pokemon => { //transmet l'erreur eventuelle de findByPk au bloc catch suivant
        if (pokemon === null){
          const message = 'le pokemon n\'existe pas, Reesayez avec un autre identifiant'
          return res.status(404).json({message})
        }
        const message = `Le pokémon ${pokemon.name} a bien été modifié.`
        res.json({message, data: pokemon })
      })
    })
    .catch(error => {
      if(error instanceof ValidationError){
        return res.status(400).json({message: error.message, data: error})
      }
      if(error instanceof UniqueConstraintError){
        return res.status(400).json({message: error.message, data: error})
      }
      const message = 'le pokemon n\'a pas pu etre modifié, Reesayez dans quelques instants'
      res.status(500).json({message, data: error})
    })
  })
}