'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Send } from 'lucide-react';
import type { SupportTicket } from '@/lib/support-ticket-types';

export function SupportTicketChat({ initialTicket, admin = false }: { initialTicket: SupportTicket; admin?: boolean }) {
  const router = useRouter();
  const [ticket, setTicket] = useState(initialTicket);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const chamfer = { clipPath: 'polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)' };
  const chamferSmall = { clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' };

  async function send() {
    if (!body.trim()) return;
    setBusy(true);
    const response = await fetch(`${admin ? '/api/admin/support/tickets' : '/api/support/tickets'}/${ticket.id}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body }) });
    setBusy(false);
    if (response.ok) {
      const data = await response.json();
      setTicket(data.ticket);
      setBody('');
      router.refresh();
    }
  }

  return (
    <div className="overflow-hidden border border-white/10 bg-[#080808] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" style={chamfer}>
      <div className="border-b border-white/10 bg-[#111] px-5 py-4">
        <div className="text-sm font-black text-white">{admin ? ticket.username : 'Pulse RP Support'}</div>
        <div className="mt-1 font-mono text-[11px] uppercase text-[var(--text-muted)]">{ticket.status} / {ticket.category}</div>
      </div>
      <div className="max-h-[620px] min-h-[420px] space-y-4 overflow-y-auto px-5 py-6">
        {ticket.messages.map((message) => {
          const outgoing = admin ? message.authorRole === 'admin' : message.authorRole === 'user';
          return (
            <div key={message.id} className={`flex ${outgoing ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[78%] ${outgoing ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`mb-1 px-2 text-[11px] font-bold ${outgoing ? 'text-right text-white/45' : 'text-left text-white/45'}`}>{message.authorName}</div>
                <div className={`px-4 py-3 text-[15px] leading-6 shadow-[0_8px_22px_rgba(0,0,0,0.25)] ${
                  outgoing
                    ? 'bg-[var(--red-primary)] text-white'
                    : 'border border-white/10 bg-[#242424] text-white'
                }`} style={chamferSmall}>
                  <div className="prose prose-invert max-w-none text-[15px] leading-6 [&_*]:my-0" dangerouslySetInnerHTML={{ __html: message.body }} />
                </div>
                <div className={`mt-1 px-2 font-mono text-[10px] text-white/35 ${outgoing ? 'text-right' : 'text-left'}`}>{new Date(message.createdAt).toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>
      {ticket.status !== 'closed' && (
        <div className="border-t border-white/10 bg-[#111] p-4">
          <div className="flex items-end gap-3 border border-white/10 bg-[#1f1f1f] p-2 pl-4" style={chamferSmall}>
            <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="iMessage" rows={1} className="max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/35" />
            <button disabled={busy || !body.trim()} onClick={send} className="grid h-10 w-10 shrink-0 place-items-center bg-[var(--red-primary)] text-white hover:bg-[var(--red-hover)] disabled:opacity-40" style={chamferSmall}><Send size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
