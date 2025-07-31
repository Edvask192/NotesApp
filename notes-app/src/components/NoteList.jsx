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
      {notes.map((note, index) => (
        <div key={index} className="note-card" data-category={note.category}>
          {editingIndex === index ? (
            <>
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <button onClick={handleSave}>💾 Išsaugoti</button>
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
      ))}
    </div>
  );
}

export default NoteList;
