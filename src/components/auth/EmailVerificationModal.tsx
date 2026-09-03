import React, { useState } from 'react';
import { X, MailCheck, ArrowRight, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';
import { AuthUser } from '../../types/auth';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  onVerified: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  user,
  onVerified,
}) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  const [currentSampleCode, setCurrentSampleCode] = useState(
    authService.generateVerificationCode(user.id)
  );

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setErrorMsg('Please enter the 6-digit code sent to your email.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    const res = await authService.verifyEmail(user.id, code);
    setIsVerifying(false);

    if (res.success) {
      onVerified();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResend = () => {
    const newCode = authService.generateVerificationCode(user.id);
    setCurrentSampleCode(newCode);
    setResendStatus('New 6-digit verification code sent to your email.');
    setTimeout(() => setResendStatus(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-400">
              <MailCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Email Address Verification</h3>
              <p className="text-[11px] text-slate-300">JH Innovation Connect &bull; Security Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            We have sent an authentication verification code to{' '}
            <strong className="text-slate-900 font-bold">{user.email}</strong>. Please enter the 6-digit code below to confirm your account identity.
          </p>

          {/* Simulated Email Dispatch Box for seamless test/evaluation */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Generated Verification Code:</span>
              <span className="font-mono text-base font-black text-emerald-800 tracking-widest">
                {currentSampleCode}
              </span>
            </div>
            <p className="text-[10px] text-emerald-700 mt-1">
              (Prototype Demo Mode: Real SMTP server simulated)
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <span className="font-bold shrink-0">&bull;</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {resendStatus && (
            <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{resendStatus}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. 123456"
                className="w-full text-center font-mono text-lg font-bold tracking-widest py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleResend}
                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend Code</span>
              </button>
              <button
                type="button"
                onClick={() => setCode(currentSampleCode)}
                className="text-slate-500 hover:text-slate-700 underline text-[11px]"
              >
                Auto-fill Code
              </button>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Verify Later
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <span>{isVerifying ? 'Verifying...' : 'Verify & Activate'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
