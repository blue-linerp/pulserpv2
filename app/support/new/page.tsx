import { SupportTicketForm } from '@/components/SupportTicketForm';
import { CinematicBackground } from '@/components/CinematicBackground';
import { requireUser } from '@/lib/auth';

export default async function NewSupportTicketPage() {
  await requireUser();
  return (
    <main className="relative px-5 pb-24 pt-36">
      <CinematicBackground variant="subtle" />
      <SupportTicketForm />
    </main>
  );
}
