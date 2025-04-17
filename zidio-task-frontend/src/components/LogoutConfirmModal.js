import { Dialog } from "@headlessui/react";

const LogoutConfirmModal = ({ open, setOpen, onConfirm }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm bg-white rounded p-6">
          <Dialog.Title className="text-lg font-semibold mb-4">Confirm Logout</Dialog.Title>
          <p className="mb-6">Are you sure you want to log out?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default LogoutConfirmModal;
