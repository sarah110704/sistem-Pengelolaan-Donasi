function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
    >
      Edit
    </button>
  );
}

export default EditButton;
