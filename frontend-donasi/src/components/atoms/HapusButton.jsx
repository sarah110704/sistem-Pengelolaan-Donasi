function HapusButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
    >
      Hapus
    </button>
  );
}

export default HapusButton;
