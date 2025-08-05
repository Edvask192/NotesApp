import './NoteInput.css';
import { useState } from 'react';
import { Save, Trash2, FileEdit } from 'lucide-react';

function NoteInput({
  title,
  setTitle,
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
  const handleSave = () => {
    handleAddNote({
      title: title.trim(),
      text: note.trim(),
    });
  };

  return (
    <div className="note-input-wrapper">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Įvesk pavadinimą"
      />

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Įvesk užrašą"
      />

      <button className="icon-btn save" onClick={handleSave}>
        <Save size={16} /> Išsaugoti užrašą
      </button>

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
        className="icon-btn delete"
      >
        <Trash2 size={16} /> Ištrinti pasirinktą kategoriją
      </button>

      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="Nauja kategorija"
        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
      />
    </div>
  );
}

export default NoteInput;
