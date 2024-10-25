export const ConfirmationModal = ({
  onConfirm,
  onCancel,
  message,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}) => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-5 rounded shadow-lg">
      <p>{message}</p>
      <div className="flex space-x-2">
        <button
          onClick={onConfirm}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);
