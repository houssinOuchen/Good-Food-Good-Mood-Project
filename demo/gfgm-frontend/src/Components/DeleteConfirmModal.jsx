"use client"

const DeleteConfirmModal = ({ show, onConfirm, onCancel, title, message, itemType = "item" }) => {
    if (!show) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-exclamation-triangle text-2xl text-red-600"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{title || "Confirm Deletion"}</h3>
                    <p className="text-slate-600 mb-8">
                        {message ||
                            `Are you sure you want to delete this ${itemType}? This action cannot be undone and all associated data will be permanently removed.`}
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={onCancel}
                            className="px-8 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-semibold transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            Delete Permanently
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmModal
