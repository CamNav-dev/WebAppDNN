const RenameModal = ({ isOpen, onClose, onSave, fileName, setFileName }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl font-bold mb-4">Rename File</h2>
          <p className="mb-4">Please provide a new name for {fileName}.</p>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="border p-2 w-full mb-4"
          />
          <div className="flex justify-end">
            <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded mr-2">Cancel</button>
            <button onClick={onSave} className="bg-blue-500 text-white py-2 px-4 rounded">Confirm</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default RenameModal;
  