import React, { useState } from 'react';
import { Mail, ExternalLink, Shield, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useConfig } from '../../context/ConfigContext';

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectUrl: string;
}

export const ConnectAccountModal: React.FC<ConnectAccountModalProps> = ({
  isOpen,
  onClose,
  connectUrl,
}) => {
  const { isDemoMode } = useConfig();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleConnectRedirect = () => {
    setIsRedirecting(true);
    // Google OAuth requires a top-level browser redirect to the backend auth endpoint
    window.location.href = connectUrl;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Connect Gmail Account"
      description="Authorize read-only Gmail access via official Google OAuth 2.0"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isRedirecting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isRedirecting}
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            onClick={handleConnectRedirect}
          >
            Authenticate with Google
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Google OAuth 2.0 Redirect Flow
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Clicking authenticate will redirect you to Google's consent screen. Once granted, Google sends the authorization code back to your backend service to securely exchange for tokens.
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700/80 break-all">
            <span className="text-neutral-400 select-none">Target: </span>
            {connectUrl}
          </div>
        </div>

        {/* Security Checklist */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-800 dark:text-neutral-200">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Frontend Security Guarantee</span>
          </div>
          <ul className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5 pl-6 list-disc">
            <li>OAuth access and refresh tokens are strictly held in backend MongoDB storage.</li>
            <li>Tokens are never transmitted to or stored in client-side localStorage.</li>
            <li>Only email address, account ID, and synchronization status are exposed.</li>
          </ul>
        </div>

        {isDemoMode && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              <strong>Demo Environment Active:</strong> Ensure your backend is running at <code className="font-mono text-[11px]">http://localhost:8002</code> with valid <code className="font-mono text-[11px]">GMAIL_CLIENT_ID</code> and <code className="font-mono text-[11px]">GMAIL_CLIENT_SECRET</code> before completing the Google consent flow.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};
