// THis code is not been used now. It is used to delete the confirmation modal for deleting the campaign.
//  But will be considered in future for deleting the campaign.
interface DeleteConfirmationModalProps {
    deleteTarget: { type: string } | null;
    handleDelete: () => void;
    setShowDeleteModal: (show: boolean) => void;
    setDeleteTarget: (target: { type: string } | null) => void;
  }
  
  const DeleteConfirmationModal = ({
    deleteTarget,
    handleDelete,
    setShowDeleteModal,
    setDeleteTarget,
  }: DeleteConfirmationModalProps) => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
          <p className="mb-6">
            Are you sure you want to delete this {deleteTarget?.type}?
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteTarget(null);
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };


  export default DeleteConfirmationModal;