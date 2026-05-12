import { CreditCard, Database, Link2, Lock, Shield, UserCog, Users } from 'lucide-react';
import { LegalPage } from '@/components/LegalPage';

const sections = [
  {
    id: 'collection',
    title: 'Information We Collect',
    icon: Database,
    body: 'Pulse RP may collect Steam profile details, Discord account details when linked, application responses, queue activity, support ticket information, IP/device metadata supplied by hosting providers, and membership webhook information from Ko-fi.'
  },
  {
    id: 'usage',
    title: 'How We Use Information',
    icon: UserCog,
    body: 'We use information to authenticate users, review applications, manage queue access, assign community perks, moderate rule violations, provide support, improve services, and protect community safety.'
  },
  {
    id: 'logins',
    title: 'Steam and Discord Login',
    icon: Link2,
    body: 'When you sign in or link accounts, we store basic profile identifiers such as Steam ID, display name, avatar, Discord ID, and Discord username so site features can recognize your account.'
  },
  {
    id: 'payments',
    title: 'Membership and Payment Data',
    icon: CreditCard,
    body: 'Pulse RP does not process payment card data directly. Ko-fi handles checkout and may send webhook events confirming membership tier, name, email, transaction ID, and subscription status.'
  },
  {
    id: 'sharing',
    title: 'Data Sharing',
    icon: Users,
    body: 'We do not sell your personal data. Information may be shared with authorized staff, service providers, or platform providers when needed for moderation, technical support, legal compliance, or community operations.'
  },
  {
    id: 'retention',
    title: 'Data Retention',
    icon: Lock,
    body: 'We retain account, application, moderation, support, and membership records for as long as needed to operate Pulse RP, resolve disputes, enforce rules, and maintain community integrity.'
  },
  {
    id: 'choices',
    title: 'Your Choices',
    icon: Shield,
    body: 'You may request account review, Discord unlinking, or data correction through support. Some information may need to be retained for moderation, fraud prevention, or operational records.'
  }
];

export default function PrivacyPage() {
  return <LegalPage title="Privacy" accent="Policy" eyebrow="Pulse RP Legal" subtitle="How Pulse RP collects, uses, stores, and protects community website and account information." noticeTitle="Privacy Notice" noticeBody="Pulse RP uses account information only to operate community systems, review applications, manage queue access, and protect the server." quickItems={['Steam Login', 'Discord Linking', 'Applications', 'Ko-fi Webhooks', 'Support Records', 'Moderation Logs']} sections={sections} />;
}
