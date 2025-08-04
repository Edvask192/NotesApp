import "./NoteList.css";

function NoteList({
  notes,
  handleDelete,
  handleEdit,
  handleSave,
  editingIndex,
  editedText,
  setEditedText,
}) {
  return (
    <div className="note-list">
      {notes.map((note, index) => {
        const categoryClass = `category-${(note.category || "nenurodyta").toLowerCase()}`;

        return (
          <div key={index} className={`note-card ${categoryClass}`}>
            {editingIndex === index ? (
              <>
                <textarea
                  className="edit-textarea"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <div className="note-actions">
                  <button className="save-btn" onClick={handleSave}>
                    💾 Išsaugoti
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="note-text">{note.text}</div>
                <small><strong>Sukurta:</strong> {note.createdAt || note.date}</small><br />
                {note.updatedAt && (
                  <small><strong>Redaguota:</strong> {note.updatedAt}</small>
                )}<br />
                <small><strong>Kategorija:</strong> {note.category || "nenurodyta"}</small>
                <div className="note-actions">
                  <button onClick={() => handleEdit(index)}>✏️ Redaguoti</button>
                  <button onClick={() => handleDelete(index)}>🗑️ Ištrinti</button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default NoteList;
