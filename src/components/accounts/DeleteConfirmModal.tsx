import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { GmailAccount } from '../../types/account.types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  account: GmailAccount | null;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  account,
  isDeleting,
}) => {
  if (!account) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Gmail Account"
      description="Permanent removal of connected account credentials and sync configuration."
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-2.5">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" isLoading={isDeleting} onClick={onConfirm}>
            Delete Account
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Destructive Action</p>
            <p>
              Are you sure you want to disconnect and delete{' '}
              <strong className="font-mono text-neutral-900 dark:text-neutral-100">{account.email}</strong>?
            </p>
          </div>
        </div>

        <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5 pl-1">
          <p>This action will:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Revoke scheduled 23:00 IST synchronization for this account.</li>
            <li>Purge OAuth credentials from the MongoDB account store.</li>
            <li>Preserve historical Neo4j classification graph summaries.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
