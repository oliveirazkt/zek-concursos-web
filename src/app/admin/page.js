'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function publish(event) {
    event.preventDefault();
    if (!file) return;
    setBusy(true); setMessage('Validando e publicando…');
    try {
      const response = await fetch('/api/catalog', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: await file.text() });
      const result = await response.json();
      setMessage(response.ok ? 'Concurso publicado no catálogo.' : result.error || 'Falha na publicação.');
    } catch { setMessage('Não foi possível conectar ao servidor.'); }
    finally { setBusy(false); }
  }
  return <main className="mx-auto max-w-xl p-8 space-y-6">
    <h1 className="text-3xl font-semibold">NEXO · Administração</h1>
    <p>Publique um pacote de concurso revisado no formato nexo-edital. O arquivo permanece no navegador até confirmar.</p>
    <form onSubmit={publish} className="space-y-4">
      <label className="block">Token de administração<input type="password" value={token} onChange={e => setToken(e.target.value)} className="block w-full border rounded p-3 mt-2" required /></label>
      <label className="block">Pacote JSON revisado<input type="file" accept="application/json,.json" onChange={e => setFile(e.target.files?.[0])} className="block mt-2" required /></label>
      <button disabled={busy} className="rounded bg-red-700 text-white px-5 py-3 disabled:opacity-50">{busy ? 'Publicando…' : 'Publicar concurso'}</button>
    </form>
    <p role="status">{message}</p>
  </main>;
}
