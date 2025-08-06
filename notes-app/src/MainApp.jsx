import { useEffect, useState } from "react";
import NoteInput from "./components/NoteInput";
import NoteList from "./components/NoteList";
import "./MainApp.css";
import { useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Pin, XCircle, FileEdit, Lock, Sun, Moon } from "lucide-react";

function MainApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
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

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

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

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/notes", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Nepavyko gauti užrašų");
        return res.json();
      })
      .then(data => {
        setNotes(data);
      })
      .catch(() => {
        const localNotes =
          JSON.parse(localStorage.getItem(`notes_${userKey}`)) || [];
        setNotes(localNotes);
      });

    const userCategories =
      JSON.parse(localStorage.getItem(`categories_${userKey}`)) || [];
    setCategories(userCategories);
  }, [userKey]);

  useEffect(() => {
    if (userKey) {
      localStorage.setItem(`categories_${userKey}`, JSON.stringify(categories));
    }
  }, [categories, userKey]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddNote = ({ title, text }) => {
    if (!title.trim() && !text.trim()) return;

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: title.trim(),
        text: text.trim(),
        category: category || "nenurodyta"
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Nepavyko pridėti užrašo");
        return res.json();
      })
      .then(newNote => {
        setNotes([newNote, ...notes]);
        setTitle("");
        setNote("");
        setCategory("");
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleUpdateNote = (id, updatedData) => {
    setNotes(
      notes.map((n) =>
        n.id === id
          ? {
              ...n,
              ...updatedData,
              updatedAt: new Date().toISOString(),
            }
          : n
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
    setNotes(
      notes.map((note) =>
        note.category === cat ? { ...note, category: "nenurodyta" } : note
      )
    );
  };

  if (!userKey) return null;

  return (
    <div className="app-container">
      <aside className="sidebar">
        <details open>
          <summary>
            <Pin size={16} /> Filtravimas
          </summary>
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
            <XCircle size={16} /> Išvalyti filtrą
          </button>
        </details>

        <details open>
          <summary>
            <FileEdit size={16} /> Naujas užrašas
          </summary>
          <NoteInput
            title={title}
            setTitle={setTitle}
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

        <div className="sidebar-bottom">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="icon-btn theme-toggle"
            title={
              isDarkMode ? "Perjungti į šviesią temą" : "Perjungti į tamsią temą"
            }
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={handleLogout} className="icon-btn logout">
            <Lock size={16} />
          </button>
        </div>
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
