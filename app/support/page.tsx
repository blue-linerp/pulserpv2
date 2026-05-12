import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import { CinematicBackground } from '@/components/CinematicBackground';
import { requireUser } from '@/lib/auth';
import { listUserSupportTickets } from '@/lib/support-tickets';

export const dynamic = 'force-dynamic';

const statusStyles: Record<string, string> = {
  open: 'border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.1)] text-[var(--online-green)]',
  pending: 'border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)]',
  closed: 'border-white/10 bg-white/[0.03] text-white/55'
};

export default async function SupportPage() {
  const user = await requireUser();
  const tickets = listUserSupportTickets(user.steamId);
  const chamfer = { clipPath: 'polygon(18px 0%, 100% 0%, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0% 100%, 0% 18px)' };
  const chamferSmall = { clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' };
  return (
    <section className="relative px-5 pb-24 pt-36">
      <CinematicBackground variant="subtle" />
      <div className="relative mx-auto max-w-[1280px]">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="eyebrow">Support</div>
            <h1 className="pulse-heading mt-4 text-5xl text-white sm:text-6xl lg:text-7xl">Need a hand?</h1>
            <p className="mt-5 text-base leading-7 text-white/55">
              Open a ticket and our staff team will respond as fast as possible. Track all your conversations in one place.
            </p>
          </div>
          <Link href="/support/new" className="btn-primary">
            <Plus size={14} /> New Ticket
          </Link>
        </div>

        <div className="overflow-hidden border border-white/10 bg-gradient-to-b from-[rgba(15,15,15,0.55)] to-[rgba(8,8,8,0.85)] shadow-[0_24px_80px_-30px_rgba(220,38,38,0.45)] backdrop-blur-xl" style={chamfer}>
          {tickets.length === 0 ? (
            <div className="px-7 py-20 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center bg-[rgba(220,38,38,0.1)] ring-1 ring-[rgba(220,38,38,0.25)] text-[var(--red-bright)]" style={chamferSmall}>
                <Plus size={22} />
              </div>
              <h2 className="mt-6 font-['Oswald',sans-serif] text-2xl font-semibold text-white">No tickets yet</h2>
              <p className="mt-3 max-w-sm mx-auto text-sm leading-6 text-white/55">
                You haven&apos;t opened any support tickets. Need help with something? Start your first conversation now.
              </p>
              <Link href="/support/new" className="btn-primary mt-7">
                <Plus size={14} /> Open First Ticket
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="border-b border-white/10">
                  <tr className="text-left">
                    <th className="px-7 py-5 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">Category</th>
                    <th className="px-7 py-5 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">Title</th>
                    <th className="px-7 py-5 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">Status</th>
                    <th className="px-7 py-5 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">Last Updated</th>
                    <th className="px-7 py-5" />
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="group border-t border-white/5 transition hover:bg-white/[0.03]">
                      <td className="px-7 py-5 text-white/70">{ticket.category}</td>
                      <td className="px-7 py-5">
                        <Link href={`/support/${ticket.id}`} className="font-semibold text-white transition group-hover:text-[var(--red-bright)]">{ticket.title}</Link>
                      </td>
                      <td className="px-7 py-5">
                        <span className={`inline-flex items-center gap-1.5 border px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.25em] ${statusStyles[ticket.status] || statusStyles.closed}`} style={chamferSmall}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-7 py-5 font-mono text-xs text-white/55">{new Date(ticket.updatedAt).toLocaleString()}</td>
                      <td className="px-7 py-5 text-right">
                        <Link href={`/support/${ticket.id}`} className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45 transition hover:text-white">
                          Open <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
