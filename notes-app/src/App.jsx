// App.jsx (su UX pertvarkymais)
import { useState, useEffect } from "react";
import NoteInput from "./components/NoteInput";
import NoteList from "./components/NoteList";
import "./App.css";

const capitalize = (word) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};

function App() {
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState([]);
  const [notification, setNotification] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("visos");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : ["darbo", "asmeniniai", "svarbūs"];
  });

  useEffect(() => {
    fetch("http://localhost:3001/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Klaida gaunant užrašus:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim().toLowerCase();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (cat) => {
    if (cat === categoryFilter) setCategoryFilter("visos");
    if (cat === category) setCategory("");
    setCategories(categories.filter((c) => c !== cat));
  };

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
        headers: { "Content-Type": "application/json" },
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
          showNotification("✅ Užrašas išsaugotas!");
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
        setNotes((prev) => prev.filter((_, i) => i !== indexToDelete));
        showNotification("🗑️ Užrašas ištrintas!");
      })
      .catch((err) => console.error("Trinimo klaida:", err));
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNote),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Redagavimo klaida");
        setNotes((prev) =>
          prev.map((n, i) => (i === editingIndex ? updatedNote : n))
        );
        setEditingIndex(null);
        setEditedText("");
        showNotification("✏️ Užrašas atnaujintas!");
      })
      .catch((err) => console.error("Redagavimo klaida:", err));
  };

  const handleExportTxt = () => {
    if (notes.length === 0) return;
    const content = notes
      .map((note, i) => `\n📌 Užrašas #${i + 1}\n──────────────────────────────\n📝 Tekstas:\n${note.text.trim()}\n\n📅 Sukurta: ${note.createdAt || note.date}\n🕓 Atnaujinta: ${note.updatedAt || "–"}\n🏷️ Kategorija: ${note.category || "nenurodyta"}`)
      .join(`\n\n==============================\n\n`);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mano-uzrasai.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredNotes = notes.filter((n) => {
    const matchesText = n.text.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "visos" || n.category === categoryFilter;
    const noteDate = new Date(n.createdAt || n.date);
    const fromDateValid = dateFrom ? noteDate >= new Date(dateFrom) : true;
    const toDateValid = dateTo ? noteDate <= new Date(dateTo + "T23:59:59") : true;
    return matchesText && matchesCategory && fromDateValid && toDateValid;
  });

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h1>Mano užrašai</h1>

        <details open>
          <summary>🔍 Filtravimas</summary>
          <input
            type="text"
            placeholder="Ieškoti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label>Nuo</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <label>Iki</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="visos">Visos kategorijos</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{capitalize(cat)}</option>
            ))}
          </select>
          <button className="clear-dates-btn" onClick={() => {
            setDateFrom("");
            setDateTo("");
          }}>❌ Išvalyti filtrą</button>
        </details>

        <details>
          <summary>📝 Naujas užrašas</summary>
          <NoteInput
            note={note}
            setNote={setNote}
            handleAddNote={handleAddNote}
            category={category}
            setCategory={setCategory}
            categories={categories}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            handleAddCategory={handleAddCategory}
            handleDeleteCategory={handleDeleteCategory}
          />
        </details>

        <details>
          <summary>⚙️ Kiti veiksmai</summary>
          <button onClick={handleExportTxt}>📤 Eksportuoti TXT</button>
          <button onClick={() => setDarkMode(!darkMode)}>
            🎨 Tema: {darkMode ? "Tamsi" : "Šviesi"}
          </button>
        </details>
      </aside>

      <main className="main-content">
        {notification && <div className="notification">{notification}</div>}
        <NoteList
          notes={filteredNotes}
          handleDelete={handleDeleteNote}
          handleEdit={handleEditNote}
          handleSave={handleSaveEdit}
          editingIndex={editingIndex}
          editedText={editedText}
          setEditedText={setEditedText}
        />
      </main>
    </div>
  );
}

export default App;
