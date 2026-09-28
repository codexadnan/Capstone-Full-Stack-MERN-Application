import { useEffect, useRef } from 'react';

// Accessible modal built on the native <dialog> element
export default function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}
      aria-labelledby="modal-title"
    >
      {open && (
        <div className="modal-body">
          <h2 id="modal-title">{title}</h2>
          {children}
        </div>
      )}
    </dialog>
  );
}
