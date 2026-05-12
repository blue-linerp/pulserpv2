import { BookOpen, FileText, Gavel, Server, Shield, Users } from 'lucide-react';
import { LegalPage } from '@/components/LegalPage';

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: FileText,
    body: 'By accessing the Pulse RP website, Discord, FiveM server, applications, queue system, subscriptions, or related services, you agree to follow these Terms of Service and all posted community rules.'
  },
  {
    id: 'community-access',
    title: 'Community Access',
    icon: Users,
    body: 'Pulse RP may approve, deny, suspend, or remove access to the community at any time to protect server quality, safety, roleplay standards, and community integrity.'
  },
  {
    id: 'user-conduct',
    title: 'User Conduct',
    icon: Shield,
    body: 'You agree not to harass others, exploit systems, cheat, evade moderation, submit false information, misuse applications, or interfere with community operations.'
  },
  {
    id: 'applications-queue',
    title: 'Applications and Queue Access',
    icon: BookOpen,
    body: 'Applications, allowlist access, queue priority, and staff decisions are not guaranteed. Queue priority may change based on active membership status, administrative review, or technical requirements.'
  },
  {
    id: 'digital-memberships',
    title: 'Digital Memberships',
    icon: Gavel,
    body: 'Memberships may provide community perks such as queue priority, Discord roles, or cosmetic recognition. These perks do not purchase ownership, staff influence, moderation immunity, or guaranteed server access.'
  },
  {
    id: 'availability',
    title: 'Service Availability',
    icon: Server,
    body: 'Pulse RP services may be unavailable during maintenance, outages, updates, moderation events, FiveM platform issues, or other circumstances outside our control.'
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    icon: FileText,
    body: 'We may update these Terms at any time. Continued use of Pulse RP after changes are posted means you accept the updated terms.'
  }
];

export default function TermsPage() {
  return <LegalPage title="Terms of" accent="Service" eyebrow="Pulse RP Legal" subtitle="Rules for using Pulse RP services, website features, queue access, applications, and community platforms." noticeTitle="Important Notice" noticeBody="These terms apply to all Pulse RP platforms. Staff may take action to protect the community even when a situation is not listed word-for-word here." quickItems={['Community Access', 'Queue Systems', 'Membership Terms', 'Staff Decisions', 'Service Availability', 'Rule Compliance']} sections={sections} />;
}
