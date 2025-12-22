import { UserX, AlertTriangle } from 'lucide-react'
import './ReportModal.css'

/**
 * Confirmation modal for blocking users
 */
function BlockConfirmModal({ user, onConfirm, onCancel, isBlocking }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content block-confirm-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-content">
                        <UserX size={24} className="warning-icon" />
                        <h2>Block {user.name}?</h2>
                    </div>
                </div>

                <div className="block-warning">
                    <AlertTriangle size={20} />
                    <div>
                        <p><strong>Blocking this user will:</strong></p>
                        <ul>
                            <li>Remove them from your swipe deck</li>
                            <li>Hide all existing matches with them</li>
                            <li>Prevent them from seeing your profile</li>
                            <li>Stop all message notifications</li>
                        </ul>
                        <p className="note">You can unblock them anytime from your settings.</p>
                    </div>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary"
                        disabled={isBlocking}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn btn-danger"
                        disabled={isBlocking}
                    >
                        <UserX size={18} />
                        {isBlocking ? 'Blocking...' : 'Block User'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BlockConfirmModal
