import { useState } from "react";
import { Trash2, Save, Edit2 } from "lucide-react";
import "./NoteList.css";

function NoteList({ notes, handleDeleteNote, handleUpdateNote, filter }) {
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedText, setEditedText] = useState("");

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
    setEditedText(note.text);
  };

  const saveEditedNote = () => {
    handleUpdateNote(editingNoteId, editedText);
    setEditingNoteId(null);
    setEditedText("");
  };

  return (
    <div className="note-list">
      {notes.filter(applyFilter).map((note) => (
        <div
          key={note.id}
          className={`note-card category-${note.category || "nenurodyta"}`}
        >
          {editingNoteId === note.id ? (
            <>
              <textarea
                className="edit-textarea"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <button className="save-btn" onClick={saveEditedNote}>
                <Save size={16} style={{ marginRight: 4 }} />
                Išsaugoti
              </button>
            </>
          ) : (
            <>
              <div className="note-text">{note.text}</div>
              <div className="note-actions">
                <button onClick={() => startEditing(note)}>
                  <Edit2 size={14} /> Redaguoti
                </button>
                <button onClick={() => handleDeleteNote(note.id)}>
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
