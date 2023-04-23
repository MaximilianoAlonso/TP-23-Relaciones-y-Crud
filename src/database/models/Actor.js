module.exports = (sequelize, dataTypes) => {
    let alias = 'Actor';
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        // created_at: dataTypes.TIMESTAMP,
        // updated_at: dataTypes.TIMESTAMP,
        first_name: {
            type: dataTypes.STRING(100),
            allowNull: false
        },
        last_name: {
            type: dataTypes.STRING(100),
            allowNull: false
        },
        rating: {
            type: dataTypes.DECIMAL(3,1),
            allowNull: false
        },
        favorite_movie_id: dataTypes.BIGINT(10).UNSIGNED
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    }
    const Actor = sequelize.define(alias, cols, config); 

    //Aquí debes realizar lo necesario para crear las relaciones con el modelo (Movie)
 Actor.associate = function(models){

      //relacion movies > actors
        //relacion de muchos a muchos
        Actor.belongsTo(models.Movie,{
            //as es alias donde despues se hace un include en el controlador
        as:"favorite",
            //foreignKey es la coluna que quiero asociasr de la tabla movies
        foreignKey: "favorite_movie_id"
        })
        Actor.belongsToMany(models.Movie,{
            as:"movies",
            //tabla pivot
            through : "actor_movie",
            //hace referencia al aid de la tabla donde estoy parado
            foreignKey: "actor_id",
            //hace referencia al id de la tabla actor
            otherKey: "movie_id"
        })
    
 }
    return Actor
};