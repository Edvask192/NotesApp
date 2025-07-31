import { useState, useEffect } from "react";
import NoteInput from "./components/NoteInput";
import NoteList from "./components/NoteList";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Klaida gaunant užrašus:", err));
  }, []);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("visos");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleAddNote = () => {
    if (note.trim() !== "") {
      const timestamp = new Date().toLocaleString("lt-LT");

      const newNote = {
        text: note,
        date: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
        category: category,
      };

      fetch("http://localhost:3001/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Įrašymo klaida");
          return res.json();
        })
        .then(() => {
          setNotes((prev) => [...prev, newNote]);
          setNote("");
          setCategory("");
        })
        .catch((err) => console.error("Nepavyko išsaugoti:", err));
    }
  };

  const handleDeleteNote = (indexToDelete) => {
    fetch(`http://localhost:3001/api/notes/${indexToDelete}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nepavyko ištrinti");
        setNotes((prev) => prev.filter((_, index) => index !== indexToDelete));
      })
      .catch((err) => console.error("Klaida trinant užrašą:", err));
  };

  const handleEditNote = (index) => {
    setEditingIndex(index);
    setEditedText(notes[index].text);
  };

  const handleSaveEdit = () => {
    const timestamp = new Date().toLocaleString("lt-LT");

    const updatedNote = {
      ...notes[editingIndex],
      text: editedText,
      updatedAt: timestamp,
    };

    fetch(`http://localhost:3001/api/notes/${editingIndex}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNote),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nepavyko atnaujinti");
        setNotes((prev) =>
          prev.map((n, i) => (i === editingIndex ? updatedNote : n))
        );
        setEditingIndex(null);
        setEditedText("");
      })
      .catch((err) => console.error("Redagavimo klaida:", err));
  };

  const handleExportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "mano-uzrasai.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleExportTxt = () => {
    if (notes.length === 0) return;

    const content = notes
      .map(
        (n, i) =>
          `Užrašas #${i + 1}:\nTekstas: ${n.text}\nSukurta: ${n.createdAt || n.date}\nAtnaujinta: ${n.updatedAt || "–"}\nKategorija: ${n.category || "nenurodyta"}\n---`
      )
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "mano-uzrasai.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredNotes = notes.filter((n) => {
    const matchesText = n.text.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "visos" || n.category === categoryFilter;

    const noteDate = new Date(n.createdAt || n.date);
    const fromDateValid = dateFrom ? noteDate >= new Date(dateFrom) : true;
    const toDateValid = dateTo ? noteDate <= new Date(dateTo + "T23:59:59") : true;

    return matchesText && matchesCategory && fromDateValid && toDateValid;
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  return (
    <div>
      <button onClick={handleExportNotes}>💾 Eksportuoti užrašus (.json)</button>
      <button onClick={handleExportTxt}>📝 Eksportuoti (.txt)</button>

      <h1>Mano užrašai</h1>

      <button onClick={() => setDarkMode(!darkMode)}>
        Perjungti į {darkMode ? "šviesią" : "tamsią"} temą
      </button>

      <input
        type="text"
        placeholder="Ieškoti užrašo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="visos">Visos kategorijos</option>
        <option value="darbo">Darbo</option>
        <option value="asmeniniai">Asmeniniai</option>
        <option value="svarbūs">Svarbūs</option>
      </select>

      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        placeholder="Nuo"
      />
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        placeholder="Iki"
      />


      <NoteInput
        note={note}
        setNote={setNote}
        handleAddNote={handleAddNote}
        category={category}
        setCategory={setCategory}
      />

      <NoteList
        notes={filteredNotes}
        handleDelete={handleDeleteNote}
        handleEdit={handleEditNote}
        handleSave={handleSaveEdit}
        editingIndex={editingIndex}
        editedText={editedText}
        setEditedText={setEditedText}
      />
    </div>
  );
}

export default App;
