import { useEffect, useState } from "react";
import NoteInput from "./components/NoteInput";
import NoteList from "./components/NoteList";
import "./MainApp.css";
import { useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router-dom";

function MainApp() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [filter, setFilter] = useState({
    text: "",
    from: "",
    to: "",
    category: "",
  });

  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [userKey, setUserKey] = useState("");

  useEffect(() => {
    if (currentUser?.email) {
      setUserKey(currentUser.email);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!userKey) return;

    const userNotes = JSON.parse(localStorage.getItem(`notes_${userKey}`)) || [];
    const userCategories = JSON.parse(localStorage.getItem(`categories_${userKey}`)) || [];

    setNotes(userNotes);
    setCategories(userCategories);
  }, [userKey]);

  useEffect(() => {
    if (userKey) {
      localStorage.setItem(`notes_${userKey}`, JSON.stringify(notes));
    }
  }, [notes, userKey]);

  useEffect(() => {
    if (userKey) {
      localStorage.setItem(`categories_${userKey}`, JSON.stringify(categories));
    }
  }, [categories, userKey]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    const newNote = {
      id: Date.now(),
      text: note,
      category: category || "nenurodyta",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setNote("");
    setCategory("");
  };

  const handleUpdateNote = (id, newText) => {
    setNotes(
      notes.map((n) =>
        n.id === id ? { ...n, text: newText, updatedAt: new Date().toISOString() } : n
      )
    );
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const formatted = newCategory.toLowerCase();
    if (!categories.includes(formatted)) {
      setCategories([...categories, formatted]);
    }
    setNewCategory("");
  };

  const handleDeleteCategory = (cat) => {
    setCategories(categories.filter((c) => c !== cat));
    setNotes(notes.map((note) =>
      note.category === cat ? { ...note, category: "nenurodyta" } : note
    ));
  };

  if (!userKey) return null;

  return (
    <div className="app-container">
      <aside className="sidebar">
        <details open>
          <summary>📌 Filtravimas</summary>
          <input
            type="text"
            placeholder="Ieškoti..."
            value={filter.text}
            onChange={(e) => setFilter({ ...filter, text: e.target.value })}
          />
          <label>Nuo</label>
          <input
            type="date"
            value={filter.from}
            onChange={(e) => setFilter({ ...filter, from: e.target.value })}
          />
          <label>Iki</label>
          <input
            type="date"
            value={filter.to}
            onChange={(e) => setFilter({ ...filter, to: e.target.value })}
          />
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">Visos kategorijos</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              setFilter({ text: "", from: "", to: "", category: "" })
            }
            className="clear-dates-btn"
          >
            ❌ Išvalyti filtrą
          </button>
        </details>

        <details open>
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

        <button onClick={handleLogout} className="logout-icon-btn">
          🔒
        </button>
      </aside>

      <main className="main-content">
        <NoteList
          notes={notes}
          handleDeleteNote={handleDeleteNote}
          handleUpdateNote={handleUpdateNote}
          filter={filter}
        />
      </main>
    </div>
  );
}

export default MainApp;
