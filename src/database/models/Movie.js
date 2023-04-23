module.exports = (sequelize, dataTypes) => {
    let alias = 'Movie'; // esto debería estar en singular
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        // created_at: dataTypes.TIMESTAMP,
        // updated_at: dataTypes.TIMESTAMP,
        title: {
            type: dataTypes.STRING(500),
            allowNull: false,
            
        },
        rating: {
            type: dataTypes.DECIMAL(3, 1).UNSIGNED,
            allowNull: false
        },
        awards: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            allowNull: false
        },
        release_date: {
            type: dataTypes.DATEONLY,
            allowNull: true
        },
        length: dataTypes.BIGINT(10),
        genre_id: dataTypes.BIGINT(10)
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    }
    const Movie = sequelize.define(alias,cols,config);

    //Aquí debes realizar lo necesario para crear las relaciones con los otros modelos (Genre - Actor)
//asocio la tabla Movies a tabla genres
    Movie.associate = function(models){
        Movie.hasMany(models.Actor,{
            //as es alias donde despues se hace un include en el controlador
        as:"favorite",
            //foreignKey es la coluna que quiero asociasr de la tabla movies
        foreignKey: "favorite_movie_id"
        })
        //relacion movies > genreszz
        Movie.belongsTo(models.Genre,{
            //as es alias donde despues se hace un include en el controlador
        as:"genre",
            //foreignKey es la coluna que quiero asociasr de la tabla movies
        foreignKey: "genre_id"
        })
        //relacion movies > actors
        //relacion de muchos a muchos
    
        Movie.belongsToMany(models.Actor,{
            as:"actors",
            //tabla pivot
            through : "actor_movie",
            //hace referencia al id de la tabla donde estoy parado
            foreignKey: "movie_id",
            //hace referencia al id de la tabla actor
            otherKey: "actor_id"
        })
   

}
    return Movie
};