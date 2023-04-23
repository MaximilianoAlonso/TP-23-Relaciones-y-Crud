const path = require("path");
const db = require("../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");

//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;

const moviesController = {
  list: (req, res) => {
    //traigo Movies que hace referencia al modelo de Movie, y findAll que busca y develve todo de ese modelo.
    Movies.findAll().then((movies) => {
      res.render("moviesList.ejs", { movies });
    });
  },
  detail: (req, res) => {
    //traigo una peelicula deacuerdo al id que trae el req.params e incluyo la tabla de generos mediante include
    Movies.findByPk(req.params.id, {
      //include del alias definido en la relacion
      include: ["genre", "actors"],
    }).then((movie) => {
      //return res.send(movie)
      res.render("moviesDetail", { movie });
    });
  },
  new: (req, res) => {
    Movies.findAll({
      order: [["release_date", "DESC"]],
      limit: 5,
    }).then((movies) => {
      res.render("newestMovies", { movies });
    });
  },
  recomended: (req, res) => {
    Movies.findAll({
      where: {
        rating: { [db.Sequelize.Op.gte]: 8 },
      },
      order: [["rating", "DESC"]],
    }).then((movies) => {
      res.render("recommendedMovies", { movies });
    });
  },
  add: function (req, res) {
    Genres.findAll()
      .then((allGenres) => {
        return res.render("moviesAdd", { allGenres });
      })
      .catch((error) => console.log(error));
  },
  create: function (req, res) {
    const { title, rating, awards, length, release_date, genre_id } = req.body;

    db.Movie.create({
      title: title.trim(),
      rating: rating,
      awards: awards,
      length: length,
      release_date: release_date,
      genre_id: genre_id,
    })
      .then(() => {
        res.redirect("/movies");
      })
      .catch((error) => console.log(error));
  },
  edit: function (req, res) {
    const movie = db.Movie.findByPk(req.params.id);

    const allGenres = Genres.findAll({});

    Promise.all([movie, allGenres])
      .then(([movie, allGenres]) => {
        return res.render("moviesEdit", {
          Movie: {
            ...movie.dataValues,
            release_date: movie.release_date,
          },

          allGenres,
        });
      })
      .catch((error) => console.log(error));
  },
  update: function (req, res) {
    db.Movie.update(
      {
        ...req.body,
       
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then(() =>{  
      return res.redirect("/movies/detail/" + req.params.id)})
      .catch((error) => console.log(error));
  },
  delete: function (req, res) {
    db.Movie.findByPk(req.params.id)
      .then((movie) => {
        res.render("moviesDelete", { Movie: movie });
      })
      .catch((error) => console.log(error));
  },
  destroy: function (req, res) {

},
};

module.exports = moviesController;
