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
      handleAddNote();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Įvesk užrašą"
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Pasirinkti kategoriją</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nauja kategorija"
        />
        <button onClick={handleAddCategory}>➕</button>
      </div>

      <div>
        {categories.map((cat) => (
          <span key={cat} style={{ marginRight: "8px" }}>
            {cat}{" "}
            <button
              onClick={() => handleDeleteCategory(cat)}
              style={{ color: "red" }}
            >
              ❌
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default NoteInput;
