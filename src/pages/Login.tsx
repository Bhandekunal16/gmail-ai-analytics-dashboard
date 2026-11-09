import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState(''); const [otp, setOtp] = useState(''); const [adminSecret, setAdminSecret] = useState('');
  const [sent, setSent] = useState(false); const [admin, setAdmin] = useState(false); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  const { setSession } = useAuth(); const navigate = useNavigate();
  const finish = (data: { accessToken: string; user: any }) => { setSession(data.accessToken, data.user); navigate('/'); };
  const requestOtp = async () => { setBusy(true); try { const r = await apiClient.post('/auth/otp/request', { email }); setSent(true); setMessage(r.data.message); } catch (e: any) { setMessage(e.message); } finally { setBusy(false); } };
  const verify = async () => { setBusy(true); try { const r = await apiClient.post('/auth/otp/verify', { email, otp }); finish(r.data); } catch (e: any) { setMessage(e.message); } finally { setBusy(false); } };
  const loginAdmin = async () => { setBusy(true); try { const r = await apiClient.post('/auth/admin/login', { email, secret: adminSecret }); finish(r.data); } catch (e: any) { setMessage(e.message); } finally { setBusy(false); } };
  return <main className="min-h-screen grid place-items-center bg-slate-950 p-6"><section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"><h1 className="text-2xl font-bold">Gmail AI Analytics</h1><p className="mt-2 text-slate-600">Sign in to view only the Gmail accounts you own.</p><label className="mt-6 block text-sm">Email<input className="mt-1 w-full rounded border p-2" value={email} onChange={e => setEmail(e.target.value)} type="email" /></label>{admin ? <label className="mt-4 block text-sm">Administrator secret<input className="mt-1 w-full rounded border p-2" value={adminSecret} onChange={e => setAdminSecret(e.target.value)} type="password" /></label> : sent && <label className="mt-4 block text-sm">Six-digit code<input className="mt-1 w-full rounded border p-2 tracking-[.5em]" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" /></label>}<button className="mt-5 w-full rounded bg-blue-600 p-2 text-white disabled:opacity-50" disabled={busy} onClick={admin ? loginAdmin : sent ? verify : requestOtp}>{admin ? 'Sign in as administrator' : sent ? 'Verify code' : 'Send sign-in code'}</button><button className="mt-4 text-sm text-blue-700" onClick={() => { setAdmin(!admin); setMessage(''); }}> {admin ? 'Use email code instead' : 'Administrator sign in'} </button>{message && <p className="mt-4 text-sm text-slate-700">{message}</p>}</section></main>;
}
