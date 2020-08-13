const express = require("express");
const kenx = require("knex");

const db = kenx({
  client: "pg",
  connection: process.env.DATABASE_URL,
  ssl: true
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use(express.static("public"));

// res.render
app.get("/", (req, res) => {
  db.select("image")
    .from("docker_images")
    .then(data => {
      res.render("index", { image: data });
    })
    .catch(err => res.status(400).json(err));
});

// create new task
app.post("/addImage", (req, res) => {
  const { dockerImage } = req.body;
  db("docker_images")
    .insert([{ image: dockerImage }])
    .returning("*")
    .then(todo => {
      res.redirect("/");
    })
    .catch(err => {
      res.status(400).json({ message: "unable to add a new docker image" });
    });
});

app.listen(8080, () => console.log("app is running on port 8080"));

