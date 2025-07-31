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
    <ul>
      {notes.map((note, index) => (
        <li key={index} data-category={note.category}>
          {editingIndex === index ? (
            <>
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <button onClick={handleSave}>Išsaugoti</button>
            </>
          ) : (
            <>
              <div>{note.text}</div>
              <small><strong>Sukurta:</strong> {note.createdAt || note.date}</small><br />
              {note.updatedAt && (
                <small><strong>Redaguota:</strong> {note.updatedAt}</small>
              )}<br />
              <small><strong>Kategorija:</strong> {note.category || "nenurodyta"}</small><br />
              <button onClick={() => handleEdit(index)}>Redaguoti</button>
              <button onClick={() => handleDelete(index)}>Ištrinti</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
