const express = require("express");
const kenx = require("knex");

const db = kenx({
  client: "pg",
  process.env.DATABASE_URL,
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use(express.static("public"));

// res.render
app.get("/", (req, res) => {
  db.select("*")
    .from("docker_images")
    .then(data => {
      res.render("index", { images: data });
    })
    .catch(err => res.status(400).json(err));
});

// create new task
app.post("/addImage", (req, res) => {
  const { dockerImage } = req.body;
  db("docker_images")
    .insert({ image: dockerImage }, { time_added: to_timestamp(${Date.now()} / 1000.0) })
    .returning("*")
    .then(todo => {
      res.redirect("/");
    })
    .catch(err => {
      res.status(400).json({ message: "unable to add a new docker image" });
    });
});

app.listen(8080, () => console.log("app is running on port 8080"));

