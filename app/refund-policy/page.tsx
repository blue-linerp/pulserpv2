import { AlertCircle, Banknote, Ban, Clock, CreditCard, FileCheck, Receipt } from 'lucide-react';
import { LegalPage } from '@/components/LegalPage';

const sections = [
  {
    id: 'digital-memberships',
    title: 'Digital Memberships',
    icon: CreditCard,
    body: 'Pulse RP memberships are digital community perks delivered through Ko-fi, Discord, and website/queue systems. Once access or benefits are granted, purchases are generally considered final.'
  },
  {
    id: 'eligibility',
    title: 'Refund Eligibility',
    icon: FileCheck,
    body: 'Refunds may be considered only for duplicate purchases, accidental duplicate charges, technical errors that prevent delivery of all membership benefits, or other exceptional cases reviewed by staff.'
  },
  {
    id: 'non-refundable',
    title: 'Non-Refundable Situations',
    icon: Ban,
    body: 'Refunds are not guaranteed for bans, suspensions, removal from the community, failure to follow rules, application denial, dissatisfaction with roleplay outcomes, server downtime, or voluntary cancellation after benefits were used.'
  },
  {
    id: 'cancellations',
    title: 'Cancellations',
    icon: Clock,
    body: 'You may cancel recurring Ko-fi memberships through Ko-fi. Cancellation stops future billing but does not automatically refund previous payments or restore removed benefits.'
  },
  {
    id: 'request-review',
    title: 'How to Request a Refund Review',
    icon: Receipt,
    body: 'Open a support ticket with your Ko-fi email, transaction ID, membership tier, purchase date, and reason for the request. Staff will review available records and respond when possible.'
  },
  {
    id: 'processing',
    title: 'Processing',
    icon: Banknote,
    body: 'Approved refunds are processed through Ko-fi or the original payment provider when available. Processing time may vary depending on the platform and payment method.'
  },
  {
    id: 'chargebacks',
    title: 'Chargebacks',
    icon: AlertCircle,
    body: 'Chargebacks or payment disputes without contacting support first may result in membership removal, loss of queue priority, and restricted community access while the issue is investigated.'
  }
];

export default function RefundPolicyPage() {
  return <LegalPage title="Refund" accent="Policy" eyebrow="Pulse RP Legal" subtitle="Guidelines for Pulse RP digital memberships, Ko-fi payments, cancellations, and refund review requests." noticeTitle="Refund Notice" noticeBody="Pulse RP memberships are digital perks. Refund reviews are handled case-by-case and are not guaranteed once benefits are delivered or used." quickItems={['Digital Perks', 'Ko-fi Payments', 'Duplicate Charges', 'Cancellation', 'Support Review', 'Chargebacks']} sections={sections} />;
}
