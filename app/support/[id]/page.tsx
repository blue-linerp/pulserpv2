import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CinematicBackground } from '@/components/CinematicBackground';
import { SupportTicketChat } from '@/components/SupportTicketChat';
import { requireUser } from '@/lib/auth';
import { getSupportTicket } from '@/lib/support-tickets';

export const dynamic = 'force-dynamic';

export default async function SupportTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const ticket = getSupportTicket(id);
  if (!ticket || ticket.steamId !== user.steamId) notFound();
  const chamfer = { clipPath: 'polygon(18px 0%, 100% 0%, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0% 100%, 0% 18px)' };
  const chamferSmall = { clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' };
  return (
    <main className="relative px-5 pb-24 pt-36">
      <CinematicBackground variant="subtle" />
      <div className="pulse-panel relative mx-auto max-w-[1440px] overflow-hidden border border-white/10 p-8 shadow-[0_24px_80px_-30px_rgba(220,38,38,0.45)]" style={chamfer}>
        <Link href="/support" className="font-mono text-xs uppercase text-[var(--text-secondary)] hover:text-white">← Back to Tickets</Link>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">{ticket.title}</h1>
            <p className="mt-2 font-mono text-xs uppercase text-[var(--text-muted)]">{ticket.server} / {ticket.category}</p>
          </div>
          <span className="border border-green-400/30 bg-green-500/15 px-3 py-1 font-mono text-xs uppercase text-green-300" style={chamferSmall}>{ticket.status}</span>
        </div>
        <div className="mt-8"><SupportTicketChat initialTicket={ticket} /></div>
      </div>
    </main>
  );
}
