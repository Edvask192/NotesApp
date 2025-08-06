import { useState } from "react";
import { Trash2, Save, Edit2 } from "lucide-react";
import "./NoteList.css";

function NoteList({ notes, handleDeleteNote, handleUpdateNote, filter }) {
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedTitle, setEditedTitle] = useState("");

  const applyFilter = (note) => {
    const { text, from, to, category } = filter;

    if (text && !note.text.toLowerCase().includes(text.toLowerCase())) {
      return false;
    }

    const createdDate = new Date(note.createdAt);
    if (from && createdDate < new Date(from)) {
      return false;
    }

    if (to && createdDate > new Date(to)) {
      return false;
    }

    if (category && note.category !== category) {
      return false;
    }

    return true;
  };

  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditedTitle(note.title || "");
    setEditedText(note.text || "");
  };

  const saveEditedNote = () => {
    handleUpdateNote(editingNoteId, {
      title: editedTitle,
      text: editedText
    });
    setEditingNoteId(null);
    setEditedTitle("");
    setEditedText("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("lt-LT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="note-list">
      {notes.filter(applyFilter).map((note) => (
        <div
          key={note.id}
          className={`note-card category-${note.category || "nenurodyta"}`}
        >
          <div className="note-meta">
            <span className="note-category">{note.category}</span>
            <span className="note-dates">
              Sukurta: {formatDate(note.createdAt)}
              {note.updatedAt &&
                note.updatedAt !== note.createdAt && (
                  <> | Atnaujinta: {formatDate(note.updatedAt)}</>
                )}
            </span>
          </div>

          {editingNoteId === note.id ? (
            <>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="edit-title"
                placeholder="Pavadinimas"
              />

              <textarea
                className="edit-textarea"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />

              <button className="icon-btn save" onClick={saveEditedNote}>
                <Save size={16} /> Išsaugoti
              </button>
            </>
          ) : (
            <>
              <div className="note-title">
                {note.title || "(Be pavadinimo)"}
              </div>

              <div
                className="note-text"
                dangerouslySetInnerHTML={{ __html: note.text }}
              ></div>

              <div className="note-actions">
                <button className="icon-btn edit" onClick={() => startEditing(note)}>
                  <Edit2 size={14} /> Redaguoti
                </button>
                <button className="icon-btn delete" onClick={() => handleDeleteNote(note.id)}>
                  <Trash2 size={14} /> Ištrinti
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default NoteList;
