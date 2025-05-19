function DetailButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
    >
      Detail
    </button>
  );
}

export default DetailButton;
