const express = require("express");
const { syncAndSeed, Pokemon } = require("./db");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  try {
    res.send(`
      <html>
        <body style="background-color: black; color: white;">
          <h1>
            Wow you actually came here! Didn't think anyone would come to this url.
            <a href="/api/pokemon">Go here instead. Its endpoint is /api/pokemon </a>

            Since you actually came here, here's how you post a new pokemon
            fetch('');
          </h1>
          <div>
            <img style="height: 500px;" src="https://ca.slack-edge.com/E05LYDFST6K-U02UDKBM3SA-090e628e314b-72" />
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
});

app.get("/api/pokemon", async (req, res, next) => {
  try {
    res.send(await Pokemon.findAll({ order: [["id", "ASC"]] }));
  } catch (error) {
    next(error);
  }
});

app.get("/api/pokemon/:id", async (req, res, next) => {
  try {
    res.send(await Pokemon.findByPk(req.params.id));
  } catch (error) {
    next(error);
  }
});

app.post("/api/pokemon", async (req, res, next) => {
  const { name, imageURL } = req.body;
  try {
    const id = (await Pokemon.count()) + 1;
    const pokemon = await Pokemon.create({ id, name, imageURL });
    res.status(201).send(pokemon);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/pokemon/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const pokemon = await Pokemon.findByPk(id);
    await pokemon.destroy();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.put("/api/pokemon/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, imageURL } = req.body;
  try {
    const pokemon = await Pokemon.findByPk(id);
    if (name) {
      pokemon.name = name;
    }

    if (imageURL) {
      pokemon.imageURL = imageURL;
    }
    await pokemon.save();

    await pokemon.reload();

    res.send(pokemon);
  } catch (error) {
    next(error);
  }
});

app.listen(process.env.PORT || 3000);
