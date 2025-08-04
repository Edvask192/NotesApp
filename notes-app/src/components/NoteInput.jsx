import './NoteInput.css';

function NoteInput({
  note,
  setNote,
  handleAddNote,
  category,
  setCategory,
  categories,
  newCategory,
  setNewCategory,
  handleAddCategory,
  handleDeleteCategory,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const newText = note.substring(0, start) + "\n" + note.substring(end);
        setNote(newText);
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = start + 1;
        }, 0);
        e.preventDefault();
      } else {
        handleAddNote();
        e.preventDefault();
      }
    }
  };

  return (
    <div className="note-input-wrapper">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Įvesk užrašą"
        rows={4}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Pasirinkti kategoriją</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      <button
        onClick={() => category && handleDeleteCategory(category)}
        disabled={!category}
        className="delete-category-btn"
      >
        🗑 Ištrinti pasirinktą kategoriją
      </button>

      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="Nauja kategorija"
        onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
      />
    </div>
  );
}

export default NoteInput;
