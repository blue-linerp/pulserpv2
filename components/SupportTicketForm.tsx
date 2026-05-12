'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { RichTextField } from '@/components/RichTextField';
import { CustomSelect } from '@/components/CustomSelect';

export function SupportTicketForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [server, setServer] = useState('FiveM Public');
  const [category, setCategory] = useState('RP Support');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const editorRef = useRef<Editor | null>(null);
  const chamfer = { clipPath: 'polygon(18px 0%, 100% 0%, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0% 100%, 0% 18px)' };
  const chamferSmall = { clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' };

  async function submit() {
    const currentBody = editorRef.current?.getHTML() || body;
    const currentText = editorRef.current?.getText().trim() || '';
    if (!title.trim() || !currentText) {
      setError('Please add a title and message before submitting.');
      return;
    }
    setBusy(true);
    setError('');
    const response = await fetch('/api/support/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, server, category, body: currentBody }) });
    setBusy(false);
    if (response.ok) {
      const data = await response.json();
      router.push(`/support/${data.ticket.id}`);
      router.refresh();
    } else {
      const data = await response.json().catch(() => ({}));
      setError(data.error === 'missing_fields' ? 'Please add a title and message before submitting.' : 'Ticket could not be created. Please try again or contact an admin.');
    }
  }

  return (
    <form className="pulse-panel relative mx-auto max-w-[1440px] overflow-hidden border border-white/10 p-8 shadow-[0_24px_80px_-30px_rgba(220,38,38,0.45)]" style={chamfer}>
      <div className="eyebrow">Support Desk</div>
      <h1 className="pulse-heading mt-4 text-6xl text-[var(--red-primary)]">New Support Ticket</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" className="border border-[var(--border)] bg-[var(--bg-tertiary)] p-3 text-white outline-none transition focus:border-[var(--red-primary)] focus:shadow-[0_0_22px_-8px_rgba(220,38,38,0.75)]" style={chamferSmall} />
        <CustomSelect options={['FiveM Public', 'FiveM Whitelist', 'FiveM Academy']} value={server} onChange={setServer} />
        <CustomSelect options={['RP Support', 'Ban Appeal', 'Bug Report', 'Billing', 'General', 'Event Support']} value={category} onChange={setCategory} />
      </div>
      <div className="mt-6"><RichTextField placeholder={'You State ID:\nYour character name:\nFaction your apart of:\nGang name:\n\nIF THIS IS FOR AN EVENT PLEASE USE EVENT SUPPORT TICKET'} onChange={setBody} onEditorReady={(editor) => { editorRef.current = editor; }} /></div>
      {error && <div className="mt-5 border border-[var(--red-primary)]/40 bg-[var(--red-primary)]/10 px-4 py-3 text-sm text-[var(--red-primary)]" style={chamferSmall}>{error}</div>}
      <div className="mt-8 flex justify-end gap-3"><Link href="/support" className="btn-ghost">Cancel</Link><button type="button" disabled={busy} onClick={submit} className="btn-primary disabled:opacity-60">{busy ? 'Submitting...' : 'Submit'}</button></div>
    </form>
  );
}
