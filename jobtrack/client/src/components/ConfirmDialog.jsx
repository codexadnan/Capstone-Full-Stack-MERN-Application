import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  open, title, message, confirmLabel = 'Delete', loading = false, onConfirm, onCancel,
}) {
  return (
    <Modal open={open} onClose={loading ? () => {} : onCancel} title={title}>
      <p className="modal-text">{message}</p>
      <div className="modal-actions">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>Keep it</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
