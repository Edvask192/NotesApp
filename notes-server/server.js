const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const USERS_FILE = "./users.json";
const NOTES_FILE = "./notes.json";
const SECRET_KEY = "labai_slapta_rakta_zodis";

app.use(cors({
  origin: "https://notes-app-liard-chi.vercel.app", // be "/" gale
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function readNotes() {
  if (!fs.existsSync(NOTES_FILE)) return [];
  return JSON.parse(fs.readFileSync(NOTES_FILE, "utf8"));
}

function saveNotes(notes) {
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Tokenas reikalingas" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Netinkamas tokenas" });
  }
}

app.get("/", (req, res) => {
  res.json({ message: "API veikia" });
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Prašome užpildyti visus laukus" });

  const users = readUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "Vartotojas jau egzistuoja" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  saveUsers(users);

  res.json({ message: "Registracija sėkminga" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ message: "Neteisingi prisijungimo duomenys" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Neteisingas slaptažodis" });
  }

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token, email: user.email });
});

app.get("/notes", authMiddleware, (req, res) => {
  const notes = readNotes().filter(note => note.user === req.user.email);
  res.json(notes);
});

app.post("/notes", authMiddleware, (req, res) => {
  const notes = readNotes();
  const newNote = {
    id: Date.now(),
    user: req.user.email,
    title: req.body.title || "",
    text: req.body.text || "",
    category: req.body.category || "nenurodyta",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(newNote);
  saveNotes(notes);

  return res.status(201).json(newNote);
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Sveikas prisijungęs", user: req.user });
});

app.listen(PORT, () => {
  console.log(`Serveris veikia: http://localhost:${PORT}`);
});
