function NoteInput({ note, setNote, handleAddNote, category, setCategory }) {
  return (
    <div>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Įvesk užrašą"
      />
      
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Pasirinkti kategoriją</option>
        <option value="darbo">Darbo</option>
        <option value="asmeniniai">Asmeniniai</option>
        <option value="svarbūs">Svarbūs</option>
      </select>

      <button onClick={handleAddNote}>Pridėti</button>
    </div>
  );
}

export default NoteInput;
