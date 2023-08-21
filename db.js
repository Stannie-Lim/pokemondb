const Sequelize = require("sequelize");
const axios = require("axios");

const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/pokemondb"
);

const Pokemon = db.define("pokemon", {
  name: Sequelize.STRING,
  imageURL: Sequelize.TEXT,
});

const syncAndSeed = async () => {
  try {
    await db.sync({ force: true });

    const {
      data: { results: pokemonList },
    } = await axios.get("https://pokeapi.co/api/v2/pokemon?offset=0&limit=200");

    const promises = [];

    for (const pokemon of pokemonList) {
      const url = pokemon.url;

      promises.push(axios.get(url));
    }

    const response = await Promise.all(promises);

    const pokemonPromises = [];
    for (const { data } of response) {
      const {
        id,
        name,
        sprites: { front_default },
      } = data;

      pokemonPromises.push(
        Pokemon.create({ id, name, imageURL: front_default })
      );
    }

    await Promise.all(pokemonPromises);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  db,
  Pokemon,
  syncAndSeed,
};
