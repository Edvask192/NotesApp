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
  const { title, text, category, date } = req.body;

  const newNote = {
    title: title || "",
    text,
    category,
    date: date || new Date().toISOString().split("T")[0]
  };

  const data = fs.readFileSync("notes.json", "utf-8");
  const notes = JSON.parse(data || "[]");

  notes.push(newNote);
  fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2));

  res.status(201).json(newNote);
});

app.delete("/api/notes/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const data = fs.readFileSync("notes.json", "utf-8");
  const notes = JSON.parse(data || "[]");

  if (index < 0 || index >= notes.length) {
    return res.status(404).json({ message: "Užrašas nerastas" });
  }

  notes.splice(index, 1);
  fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2));

  res.status(200).json({ message: "Ištrinta sėkmingai" });
});

app.put("/api/notes/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const updatedNote = req.body;

  const data = fs.readFileSync("notes.json", "utf-8");
  const notes = JSON.parse(data || "[]");

  if (index < 0 || index >= notes.length) {
    return res.status(404).json({ message: "Užrašas nerastas" });
  }

  notes[index] = {
    ...notes[index],
    title: updatedNote.title || notes[index].title,
    text: updatedNote.text || notes[index].text,
    category: updatedNote.category || notes[index].category,
    date: updatedNote.date || notes[index].date
  };

  fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2));

  res.status(200).json(notes[index]);
});

app.listen(PORT, () => {
  console.log(`Serveris veikia: http://localhost:${PORT}`);
});
