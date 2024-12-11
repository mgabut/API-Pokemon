const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée']

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'le nom est deja pris'
        },
        validate: {
          notEmpty: {msg: 'Le nom ne peut pas etre'},
          notNull: {msg : 'Le nom est une propriété requise'}
        }
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {msg: 'Utilisez uniquement des nombres entiers pour les hp'},
          notNull: {msg : 'Les points de vie sont une propriété requise'},
          max: {
            args: [999],
            msg: 'Entrez des pv entre 0 et 999' 
          },
          min: {
            args: [0],
            msg: 'Entrez des pv entre 0 et 999' 
          }
        }
      }, 
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {msg: 'Utilisez uniquement des nombres entiers pour les cp'},
          notNull: {msg : 'Les cp sont une propriété requise'},
          max: {
            args: [99],
            msg: 'Entrez des cp entre 0 et 99' 
          },
          min: {
            args: [0],
            msg: 'Entrez des cp entre 0 et 99' 
          }
        }
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: {msg: 'Utilisez uniquement une URL pour l\'image'},
          notNull: {msg : 'L\'image est une propriété requise'}
        }
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get(){
          return this.getDataValue('types').split(',')
        },
        set(types){
          this.setDataValue('types', types.join()) 
        },
        validate: {
          isTypeValid(value){
            if(!value){
              throw new Error('Un pokemon doit avoir un type')
            }
            if((value.split)(',').length > 3){
              throw new Error('un pokemon ne peut pas avoir plus de trois types')
            }
            value.split(',').forEach(type => {
              if(!validTypes.includes(type)){
                throw new Error(`Le type d\'un pokemon doit appartenir a la liste suivante ${validTypes}`)
              }
            });
          }
        }
      }
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
    })
  }