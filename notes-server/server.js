const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/notes", (req, res) => {
  const data = fs.readFileSync("notes.json", "utf-8");
  const notes = JSON.parse(data || "[]");
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  const data = fs.readFileSync("notes.json", "utf-8");
  const notes = JSON.parse(data || "[]");

  notes.push(newNote);
  fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2));

  res.status(201).json(newNote);
});


app.listen(PORT, () => {
  console.log(`Serveris veikia: http://localhost:${PORT}`);
});
