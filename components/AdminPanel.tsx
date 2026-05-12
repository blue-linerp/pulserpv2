'use client';

import { Check, Code2, Coffee, Crown, Image as ImageIcon, MessageSquare, Palette, Plus, RefreshCw, Save, Server, Settings, Share2, ShieldCheck, Trash2, Upload, X } from 'lucide-react';
import { CinematicBackground } from '@/components/CinematicBackground';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SiteSettings } from '@/lib/settings';
import type { SessionUser } from '@/lib/auth';
import type { ApplicationRecord, ApplicationStatus } from '@/lib/applications-store';
import type { ApplicationDefinition, ApplicationQuestion, ApplicationQuestionType } from '@/lib/application-types';
import type { UserPriority, PriorityTier } from '@/lib/user-priorities-types';
import type { SupportTicket, SupportTicketStatus } from '@/lib/support-ticket-types';
import { SupportTicketChat } from '@/components/SupportTicketChat';
import { CustomSelect } from '@/components/CustomSelect';

type Tab = 'branding' | 'colors' | 'announcement' | 'socials' | 'subscriptions' | 'server' | 'advanced' | 'priorities' | 'applications' | 'support';

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'branding', label: 'Branding', icon: ImageIcon },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'announcement', label: 'Announcement', icon: Settings },
  { id: 'socials', label: 'Socials', icon: Share2 },
  { id: 'subscriptions', label: 'Subscriptions', icon: Coffee },
  { id: 'server', label: 'Server', icon: Server },
  { id: 'advanced', label: 'Advanced JSON', icon: Code2 },
  { id: 'priorities', label: 'Queue Priorities', icon: Crown },
  { id: 'applications', label: 'Applications', icon: Check },
  { id: 'support', label: 'Support Tickets', icon: MessageSquare }
];

const socialIconOptions = [{ label: 'Discord', value: 'discord' }, { label: 'X', value: 'x' }, { label: 'Youtube', value: 'youtube' }, { label: 'TikTok', value: 'tiktok' }, { label: 'Link', value: 'link' }];
const priorityTierOptions = [{ label: 'Bronze', value: 'silver' }, { label: 'Gold', value: 'gold' }, { label: 'Diamond', value: 'crimson' }];
const supportStatusOptions = [{ label: 'Open', value: 'open' }, { label: 'Pending User', value: 'pending' }, { label: 'Closed', value: 'closed' }];
const questionTypeOptions = [{ label: 'Rich Text', value: 'richtext' }, { label: 'Short Text', value: 'text' }, { label: 'Long Text', value: 'textarea' }, { label: 'Checkboxes', value: 'checkboxes' }, { label: 'Dropdown', value: 'select' }];

export function AdminPanel({ adminUser, initialSettings, initialApplications, initialApplicationDefinitions = [], initialPriorities = [], initialSupportTickets = [] }: { adminUser: SessionUser; initialSettings: SiteSettings; initialApplications: ApplicationRecord[]; initialApplicationDefinitions?: ApplicationDefinition[]; initialPriorities?: UserPriority[]; initialSupportTickets?: SupportTicket[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('branding');
  const [settings, setSettings] = useState<SiteSettings>({
    ...initialSettings,
    subscriptions: { ...initialSettings.subscriptions, enabled: initialSettings.subscriptions.enabled ?? true }
  });
  const [applications, setApplications] = useState<ApplicationRecord[]>(initialApplications);
  const [applicationDefinitions, setApplicationDefinitions] = useState<ApplicationDefinition[]>(initialApplicationDefinitions);
  const [priorities, setPriorities] = useState<UserPriority[]>(initialPriorities);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [ticketDeleteId, setTicketDeleteId] = useState('');
  const [newPrioritySteamId, setNewPrioritySteamId] = useState('');
  const [newPriorityUsername, setNewPriorityUsername] = useState('');
  const [newPriorityTier, setNewPriorityTier] = useState<PriorityTier>('silver');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [advancedSettingsJson, setAdvancedSettingsJson] = useState(() => JSON.stringify(initialSettings, null, 2));
  const [advancedSettingsError, setAdvancedSettingsError] = useState('');

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  }

  async function saveSettings(next: SiteSettings) {
    setBusy(true);
    const response = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) });
    if (response.ok) {
      const data = await response.json();
      setSettings(data.settings);
      setAdvancedSettingsJson(JSON.stringify(data.settings, null, 2));
      router.refresh();
      showToast('Settings saved');
    } else {
      showToast('Failed to save');
    }
    setBusy(false);
  }

  function applyAdvancedSettingsJson() {
    try {
      const parsed = JSON.parse(advancedSettingsJson) as SiteSettings;
      setAdvancedSettingsError('');
      setSettings(parsed);
      saveSettings(parsed);
    } catch {
      setAdvancedSettingsError('Invalid JSON. Fix formatting before saving.');
    }
  }

  async function uploadFile(file: File, target: 'logo' | 'favicon') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target', target);
    const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (!response.ok) {
      showToast('Upload failed');
      return null;
    }
    const data = await response.json();
    return data.url as string;
  }

  async function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'favicon') {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const url = await uploadFile(file, target);
    setBusy(false);
    if (url) {
      const next = { ...settings, branding: { ...settings.branding, [target === 'logo' ? 'logoUrl' : 'faviconUrl']: url } };
      setSettings(next);
      saveSettings(next);
    }
  }

  async function setApplicationStatus(id: string, status: ApplicationStatus) {
    setBusy(true);
    const response = await fetch(`/api/admin/applications/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (response.ok) {
      const data = await response.json();
      setApplications((prev) => prev.map((record) => record.id === id ? data.application : record));
      showToast(status === 'approved' ? 'Application approved' : status === 'denied' ? 'Application denied' : 'Status updated');
    } else {
      showToast('Update failed');
    }
    setBusy(false);
  }

  async function setSupportTicketStatus(id: string, status: SupportTicketStatus) {
    setBusy(true);
    const response = await fetch(`/api/admin/support/tickets/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (response.ok) {
      const data = await response.json();
      setSupportTickets((prev) => prev.map((ticket) => ticket.id === id ? data.ticket : ticket));
      showToast('Ticket status updated');
    } else {
      showToast('Ticket update failed');
    }
    setBusy(false);
  }

  async function deleteSupportTicketFromAdmin(id: string) {
    setBusy(true);
    const response = await fetch(`/api/admin/support/tickets/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setSupportTickets((prev) => prev.filter((ticket) => ticket.id !== id));
      setTicketDeleteId('');
      showToast('Ticket deleted');
    } else {
      showToast('Delete failed');
    }
    setBusy(false);
  }

  function updateBranding(key: keyof SiteSettings['branding'], value: string) {
    setSettings({ ...settings, branding: { ...settings.branding, [key]: value } });
  }
  function updateColor(key: keyof SiteSettings['colors'], value: string) {
    setSettings({ ...settings, colors: { ...settings.colors, [key]: value } });
  }
  function updateAnnouncement<K extends keyof SiteSettings['announcement']>(key: K, value: SiteSettings['announcement'][K]) {
    setSettings({ ...settings, announcement: { ...settings.announcement, [key]: value } });
  }
  function updateSocial(index: number, key: 'label' | 'href' | 'icon', value: string) {
    const next = settings.socials.map((social, i) => i === index ? { ...social, [key]: value } : social);
    setSettings({ ...settings, socials: next });
  }
  function addSocial() {
    setSettings({ ...settings, socials: [...settings.socials, { id: `social_${Date.now()}`, label: 'New Link', href: 'https://', icon: 'link' }] });
  }
  function removeSocial(index: number) {
    setSettings({ ...settings, socials: settings.socials.filter((_, i) => i !== index) });
  }
  function updateSubscriptionField<K extends keyof SiteSettings['subscriptions']>(key: K, value: SiteSettings['subscriptions'][K]) {
    setSettings({ ...settings, subscriptions: { ...settings.subscriptions, [key]: value } });
  }
  function updateTierUrl(name: string, kofiUrl: string) {
    const tiers = settings.subscriptions.tiers.map((tier) => tier.name === name ? { ...tier, kofiUrl } : tier);
    setSettings({ ...settings, subscriptions: { ...settings.subscriptions, tiers } });
  }
  function updateServerField<K extends keyof SiteSettings['server']>(key: K, value: SiteSettings['server'][K]) {
    setSettings({ ...settings, server: { ...settings.server, [key]: value } });
  }

  async function saveApplicationDefinitions(next = applicationDefinitions) {
    setBusy(true);
    const response = await fetch('/api/admin/application-definitions', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ definitions: next }) });
    if (response.ok) {
      const data = await response.json();
      setApplicationDefinitions(data.definitions);
      router.refresh();
      showToast('Applications saved');
    } else {
      showToast('Failed to save applications');
    }
    setBusy(false);
  }

  function updateApplicationDefinition(index: number, patch: Partial<ApplicationDefinition>) {
    setApplicationDefinitions((prev) => prev.map((definition, i) => i === index ? { ...definition, ...patch } : definition));
  }

  function addApplicationDefinition() {
    setApplicationDefinitions((prev) => [...prev, { id: `app_${Date.now()}`, slug: `new-application-${prev.length + 1}`, title: 'New Application', description: '', enabled: true, questions: [] }]);
  }

  function removeApplicationDefinition(index: number) {
    setApplicationDefinitions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateApplicationQuestion(appIndex: number, questionIndex: number, patch: Partial<ApplicationQuestion>) {
    setApplicationDefinitions((prev) => prev.map((definition, i) => {
      if (i !== appIndex) return definition;
      return { ...definition, questions: definition.questions.map((question, q) => q === questionIndex ? { ...question, ...patch } : question) };
    }));
  }

  function addApplicationQuestion(appIndex: number) {
    setApplicationDefinitions((prev) => prev.map((definition, i) => {
      if (i !== appIndex) return definition;
      return { ...definition, questions: [...definition.questions, { id: `question_${Date.now()}`, label: 'New Question', hint: '', type: 'text', required: true, options: [] }] };
    }));
  }

  function removeApplicationQuestion(appIndex: number, questionIndex: number) {
    setApplicationDefinitions((prev) => prev.map((definition, i) => i === appIndex ? { ...definition, questions: definition.questions.filter((_, q) => q !== questionIndex) } : definition));
  }

  function getApplicationQuestionLabel(record: ApplicationRecord, answerKey: string) {
    const definition = applicationDefinitions.find((item) => item.slug === record.type);
    return definition?.questions.find((question) => question.id === answerKey)?.label || answerKey;
  }

  async function loadPriorities() {
    setBusy(true);
    const response = await fetch('/api/admin/priorities');
    if (response.ok) {
      const data = await response.json();
      setPriorities(data.priorities);
    }
    setBusy(false);
  }

  async function addPriority() {
    if (!newPrioritySteamId || !newPriorityUsername) return;
    setBusy(true);
    const response = await fetch('/api/admin/priorities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ steamId: newPrioritySteamId, username: newPriorityUsername, tier: newPriorityTier })
    });
    if (response.ok) {
      const data = await response.json();
      setPriorities(data.priorities);
      showToast('Priority added');
      setNewPrioritySteamId('');
      setNewPriorityUsername('');
    } else {
      showToast('Failed to add priority');
    }
    setBusy(false);
  }

  async function removePriority(steamId: string) {
    setBusy(true);
    const response = await fetch(`/api/admin/priorities/${steamId}`, { method: 'DELETE' });
    if (response.ok) {
      const data = await response.json();
      setPriorities(data.priorities);
      showToast('Priority removed');
    } else {
      showToast('Failed to remove priority');
    }
    setBusy(false);
  }

  async function updatePriorityTier(steamId: string, tier: PriorityTier) {
    setBusy(true);
    const response = await fetch(`/api/admin/priorities/${steamId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier })
    });
    if (response.ok) {
      const data = await response.json();
      setPriorities(data.priorities);
      showToast('Priority updated');
    } else {
      showToast('Failed to update priority');
    }
    setBusy(false);
  }

  return (
    <section className="relative px-5 pb-24 pt-36">
      <CinematicBackground variant="subtle" />
      <div className="relative mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="chamfer-frame h-fit p-6 lg:sticky lg:top-28" style={{ '--chamfer-border': 'rgba(255,255,255,0.12)', '--chamfer-fill': 'linear-gradient(180deg, rgba(15,15,15,0.82), rgba(6,6,6,0.95))' } as React.CSSProperties}>
          <div className="flex items-center gap-4 border-b border-white/10 pb-6">
            <img src={adminUser.avatar} alt={adminUser.username} className="h-14 w-14 shrink-0 rounded-full border border-[rgba(220,38,38,0.45)] object-cover shadow-[0_0_24px_-8px_rgba(220,38,38,0.8)]" />
            <div className="min-w-0">
              <div className="font-['TT_Octosquares',sans-serif] text-sm font-bold text-white">{adminUser.username}</div>
              <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{adminUser.steamId}</div>
              <div className="mt-2 inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--red-bright)]"><ShieldCheck size={11} /> Admin Account</div>
            </div>
          </div>
          <nav className="mt-6 flex flex-col gap-2">
            {tabs.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <button key={id} onClick={() => setTab(id)} className={`group flex w-full items-center justify-between px-4 py-3 text-left font-['TT_Octosquares',sans-serif] text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-300 ${active ? 'text-white' : 'text-white/50 hover:text-white'}`} style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)', background: active ? 'linear-gradient(90deg, rgba(220,38,38,0.28), rgba(220,38,38,0.06))' : 'transparent', border: active ? '1px solid rgba(220,38,38,0.45)' : '1px solid transparent' }}>
                  <span className="flex items-center gap-3"><Icon size={14} className={active ? 'text-[var(--red-bright)]' : 'text-white/35'} />{label}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-[var(--red-bright)] shadow-[0_0_10px_rgba(220,38,38,0.8)]" />}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="eyebrow flex items-center gap-2"><ShieldCheck size={12} /> Control Center</div>
              <h1 className="pulse-heading mt-3 text-5xl text-white sm:text-6xl lg:text-7xl">
                <span className="text-stroke">Admin</span> <span className="text-glow-red text-[var(--red-bright)]">Dashboard</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">Manage site branding, content, server settings, queue access, applications, and support operations.</p>
            </div>
            {busy && (
              <span className="chamfer-frame-sm inline-flex items-center gap-2 self-start px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--red-bright)] sm:self-end" style={{ '--chamfer-border': 'rgba(220,38,38,0.4)', '--chamfer-fill': 'rgba(220,38,38,0.08)' } as React.CSSProperties}><RefreshCw size={12} className="animate-spin" /> Saving</span>
            )}
          </header>

        {tab === 'branding' && (
          <section className={panelClass}>
            <Field label="Site Name"><input value={settings.branding.siteName} onChange={(event) => updateBranding('siteName', event.target.value)} className={inputClass} /></Field>
            <Field label="Tagline"><input value={settings.branding.tagline} onChange={(event) => updateBranding('tagline', event.target.value)} className={inputClass} /></Field>
            <Field label="Business Email"><input value={settings.branding.businessEmail} onChange={(event) => updateBranding('businessEmail', event.target.value)} className={inputClass} /></Field>
            <Field label="Store URL"><input value={settings.branding.storeUrl} onChange={(event) => updateBranding('storeUrl', event.target.value)} className={inputClass} /></Field>
            <Field label="Discord URL"><input value={settings.branding.discordUrl} onChange={(event) => updateBranding('discordUrl', event.target.value)} className={inputClass} /></Field>
            <Field label="Logo">
              <div className="flex flex-wrap items-center gap-4">
                <div className="grid h-16 w-16 place-items-center overflow-hidden rounded border border-[var(--border)] bg-[var(--bg-tertiary)]">{settings.branding.logoUrl ? <img src={settings.branding.logoUrl} alt="logo" className="h-full w-full object-cover" /> : <span className="text-xs text-[var(--text-muted)]">Default</span>}</div>
                <label className="btn-ghost cursor-pointer"><Upload size={12} /> Upload Logo<input type="file" accept="image/*" className="hidden" onChange={(event) => handleLogoChange(event, 'logo')} /></label>
                {settings.branding.logoUrl && <button onClick={() => saveSettings({ ...settings, branding: { ...settings.branding, logoUrl: '' } })} className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45 transition hover:text-[var(--red-bright)]">Reset to default</button>}
              </div>
            </Field>
            <Field label="Favicon">
              <div className="flex flex-wrap items-center gap-4">
                <div className="grid h-12 w-12 place-items-center overflow-hidden rounded border border-[var(--border)] bg-[var(--bg-tertiary)]">{settings.branding.faviconUrl ? <img src={settings.branding.faviconUrl} alt="favicon" className="h-full w-full object-cover" /> : <span className="text-xs text-[var(--text-muted)]">None</span>}</div>
                <label className="btn-ghost cursor-pointer"><Upload size={12} /> Upload Favicon<input type="file" accept="image/*,.ico" className="hidden" onChange={(event) => handleLogoChange(event, 'favicon')} /></label>
              </div>
            </Field>
            <SaveBar onSave={() => saveSettings(settings)} busy={busy} />
          </section>
        )}

        {tab === 'colors' && (
          <section className={`${panelClass} grid gap-4 sm:grid-cols-2`}>
            {(Object.keys(settings.colors) as (keyof SiteSettings['colors'])[]).map((key) => (
              <label key={key} className="flex items-center gap-3 border border-white/10 bg-[rgba(8,8,8,0.85)] p-3" style={chamferStyle}>
                <input type="color" value={settings.colors[key]} onChange={(event) => updateColor(key, event.target.value)} className="h-10 w-12 cursor-pointer rounded border border-white/10 bg-transparent" />
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">{key}</div>
                  <input value={settings.colors[key]} onChange={(event) => updateColor(key, event.target.value)} className="w-full bg-transparent font-mono text-sm text-white outline-none" />
                </div>
              </label>
            ))}
            <div className="sm:col-span-2"><SaveBar onSave={() => saveSettings(settings)} busy={busy} /></div>
          </section>
        )}

        {tab === 'announcement' && (
          <section className={panelClass}>
            <label className="flex items-center gap-3 text-sm text-white/80"><input type="checkbox" checked={settings.announcement.enabled} onChange={(event) => updateAnnouncement('enabled', event.target.checked)} className="accent-[var(--red-primary)]" /> Enabled</label>
            <Field label="Title (left)"><input value={settings.announcement.title} onChange={(event) => updateAnnouncement('title', event.target.value)} className={inputClass} /></Field>
            <Field label="Body"><input value={settings.announcement.body} onChange={(event) => updateAnnouncement('body', event.target.value)} className={inputClass} /></Field>
            <Field label="CTA Label"><input value={settings.announcement.ctaLabel} onChange={(event) => updateAnnouncement('ctaLabel', event.target.value)} className={inputClass} /></Field>
            <Field label="CTA URL"><input value={settings.announcement.ctaUrl} onChange={(event) => updateAnnouncement('ctaUrl', event.target.value)} className={inputClass} /></Field>
            <SaveBar onSave={() => saveSettings(settings)} busy={busy} />
          </section>
        )}

        {tab === 'socials' && (
          <section className={`${panelClass} space-y-3`}>
            {settings.socials.map((social, index) => (
              <div key={social.id} className="grid gap-2 border border-white/10 bg-[rgba(8,8,8,0.85)] p-3 md:grid-cols-[1fr_2fr_1fr_auto]" style={chamferStyle}>
                <input value={social.label} onChange={(event) => updateSocial(index, 'label', event.target.value)} placeholder="Label" className={inputClass} />
                <input value={social.href} onChange={(event) => updateSocial(index, 'href', event.target.value)} placeholder="https://..." className={inputClass} />
                <CustomSelect options={socialIconOptions} value={social.icon} onChange={(value) => updateSocial(index, 'icon', value)} />
                <button onClick={() => removeSocial(index)} aria-label="Remove" className={iconBtnClass}><Trash2 size={13} /></button>
              </div>
            ))}
            <button onClick={addSocial} className="btn-ghost"><Plus size={12} /> Add Social</button>
            <SaveBar onSave={() => saveSettings(settings)} busy={busy} />
          </section>
        )}

        {tab === 'subscriptions' && (
          <section className={panelClass}>
            <p className={hintClass}>Set a Ko-fi membership URL per tier (find each tier's "Buy Now" / "Membership" link in your Ko-fi dashboard). The site never touches payment data — Ko-fi handles checkout. Add the webhook URL <code className="font-mono text-[var(--red-bright)]">/api/webhooks/kofi</code> in your Ko-fi webhook settings to receive membership events.</p>
            <label className="flex items-center gap-3 border border-white/10 bg-[rgba(8,8,8,0.85)] p-3 text-sm font-semibold text-white/85" style={chamferStyle}><input type="checkbox" checked={settings.subscriptions.enabled ?? true} onChange={(event) => updateSubscriptionField('enabled', event.target.checked)} className="accent-[var(--red-primary)]" /> Show Subscriptions Section</label>
            <Field label="Ko-fi Username (used as fallback profile link)"><input value={settings.subscriptions.kofiUsername} onChange={(event) => updateSubscriptionField('kofiUsername', event.target.value)} placeholder="your-kofi-handle" className={inputClass} /></Field>
            <Field label="Ko-fi Verification Token (optional, recommended)"><input value={settings.subscriptions.kofiVerificationToken} onChange={(event) => updateSubscriptionField('kofiVerificationToken', event.target.value)} placeholder="paste from Ko-fi webhook settings" className={inputClass} /></Field>
            <div className="space-y-3">
              {settings.subscriptions.tiers.map((tier) => (
                <div key={tier.name} className="grid gap-2 border border-white/10 bg-[rgba(8,8,8,0.85)] p-3 md:grid-cols-[140px_1fr]" style={chamferStyle}>
                  <div className="flex items-center gap-2 font-bold text-white"><Coffee size={14} className="text-[var(--red-bright)]" /> {tier.name}</div>
                  <input value={tier.kofiUrl} onChange={(event) => updateTierUrl(tier.name, event.target.value)} placeholder="https://ko-fi.com/.../tiers/..." className={inputClass} />
                </div>
              ))}
            </div>
            <SaveBar onSave={() => saveSettings(settings)} busy={busy} />
          </section>
        )}

        {tab === 'server' && (
          <section className={panelClass}>
            <p className={hintClass}>Configure your FiveM server settings. The max players value is displayed in the footer status and used for queue calculations.</p>
            <Field label="Max Players">
              <input
                type="number"
                min={1}
                max={128}
                value={settings.server.maxPlayers}
                onChange={(event) => updateServerField('maxPlayers', parseInt(event.target.value) || 10)}
                className={inputClass}
              />
            </Field>
            <SaveBar onSave={() => saveSettings(settings)} busy={busy} />
          </section>
        )}

        {tab === 'advanced' && (
          <section className={panelClass}>
            <p className={hintClass}>Advanced editor for the full site settings object. Use this when you need to edit fields faster than the individual forms. Invalid JSON will not be saved.</p>
            <textarea value={advancedSettingsJson} onChange={(event) => setAdvancedSettingsJson(event.target.value)} spellCheck={false} className={`${inputClass} min-h-[560px] font-mono text-xs leading-6`} />
            {advancedSettingsError && <div className="chamfer-frame-sm px-4 py-3 text-sm text-[var(--red-bright)]" style={{ '--chamfer-border': 'rgba(220,38,38,0.45)', '--chamfer-fill': 'rgba(220,38,38,0.08)' } as React.CSSProperties}>{advancedSettingsError}</div>}
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => { setAdvancedSettingsJson(JSON.stringify(settings, null, 2)); setAdvancedSettingsError(''); }} className="btn-ghost">Reset Editor</button>
              <button type="button" disabled={busy} onClick={applyAdvancedSettingsJson} className="btn-primary disabled:opacity-60"><Save size={12} /> Save JSON</button>
            </div>
          </section>
        )}

        {tab === 'priorities' && (
          <section className={panelClass}>
            <p className={hintClass}>Manage queue priority tiers for users. Bronze (+25), Gold (+50), Diamond (+75). These users get faster queue movement and reduced wait times.</p>
            <div className="grid gap-3 md:grid-cols-4">
              <input
                value={newPrioritySteamId}
                onChange={(e) => setNewPrioritySteamId(e.target.value)}
                placeholder="Steam ID"
                className={inputClass}
              />
              <input
                value={newPriorityUsername}
                onChange={(e) => setNewPriorityUsername(e.target.value)}
                placeholder="Username"
                className={inputClass}
              />
              <CustomSelect options={priorityTierOptions} value={newPriorityTier} onChange={(value) => setNewPriorityTier(value as PriorityTier)} />
              <button onClick={addPriority} disabled={!newPrioritySteamId || !newPriorityUsername} className="btn-primary disabled:opacity-50"><Plus size={12} /> Add Priority</button>
            </div>
            <div className="space-y-2">
              {priorities.length === 0 && <div className="py-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">No priority users yet.</div>}
              {priorities.map((user) => (
                <div key={user.steamId} className="flex items-center justify-between border border-white/10 bg-[rgba(8,8,8,0.85)] p-4" style={chamferStyle}>
                  <div>
                    <span className="font-semibold text-white">{user.username}</span>
                    <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{user.steamId}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="min-w-[150px]">
                      <CustomSelect options={priorityTierOptions} value={user.tier} onChange={(value) => updatePriorityTier(user.steamId, value as PriorityTier)} />
                    </div>
                    <button onClick={() => removePriority(user.steamId)} aria-label="Remove" className={iconBtnClass}><X size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'support' && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="eyebrow">Support</div>
                <h2 className="pulse-heading mt-2 text-3xl text-white">Tickets</h2>
                <p className="mt-2 text-sm text-white/55">View tickets and chat with the person who opened them.</p>
              </div>
              <button disabled={busy} onClick={async () => {
                setBusy(true);
                const response = await fetch('/api/admin/support/tickets');
                if (response.ok) {
                  const data = await response.json();
                  setSupportTickets(data.tickets);
                  showToast('Tickets refreshed');
                }
                setBusy(false);
              }} className="btn-ghost disabled:opacity-60"><RefreshCw size={12} /> Refresh</button>
            </div>
            {supportTickets.length === 0 && <div className={`${panelClass} text-center font-mono text-[11px] uppercase tracking-[0.25em] text-white/40`}>No support tickets yet.</div>}
            {supportTickets.map((ticket) => (
              <article key={ticket.id} className={panelClass}>
                <header className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--red-bright)]">{ticket.server} / {ticket.category}</div>
                    <div className="mt-1 text-lg font-bold text-white">{ticket.title}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Opened by {ticket.username} · Updated {new Date(ticket.updatedAt).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="min-w-[170px]">
                      <CustomSelect options={supportStatusOptions} value={ticket.status} onChange={(value) => setSupportTicketStatus(ticket.id, value as SupportTicketStatus)} />
                    </div>
                    <button disabled={busy} onClick={() => setTicketDeleteId(ticket.id)} className="btn-outline-red disabled:opacity-60"><Trash2 size={12} /> Delete</button>
                  </div>
                </header>
                <div className="mt-4">
                  <SupportTicketChat initialTicket={ticket} admin />
                </div>
              </article>
            ))}
          </section>
        )}

        {tab === 'applications' && (
          <section className="space-y-6">
            <div className={panelClass}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="eyebrow">Builder</div>
                  <h2 className="pulse-heading mt-2 text-3xl text-white">Application Builder</h2>
                  <p className="mt-2 text-sm text-white/55">Edit titles, slugs, descriptions, question types, options, and visibility.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={addApplicationDefinition} className="btn-ghost"><Plus size={12} /> Add Application</button>
                  <button disabled={busy} onClick={() => saveApplicationDefinitions()} className="btn-primary disabled:opacity-60"><Save size={12} /> Save</button>
                </div>
              </div>
              <div className="mt-5 space-y-5">
                {applicationDefinitions.map((definition, appIndex) => (
                  <article key={definition.id} className="border border-white/10 bg-[rgba(8,8,8,0.85)] p-5" style={chamferStyle}>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Title"><input value={definition.title} onChange={(event) => updateApplicationDefinition(appIndex, { title: event.target.value })} className={inputClass} /></Field>
                      <Field label="Slug"><input value={definition.slug} onChange={(event) => updateApplicationDefinition(appIndex, { slug: event.target.value })} className={inputClass} /></Field>
                      <Field label="Description"><textarea value={definition.description} onChange={(event) => updateApplicationDefinition(appIndex, { description: event.target.value })} className={`${inputClass} min-h-24 md:col-span-2`} /></Field>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm font-bold text-white"><input type="checkbox" checked={definition.enabled} onChange={(event) => updateApplicationDefinition(appIndex, { enabled: event.target.checked })} className="accent-[var(--red-primary)]" /> Enabled</label>
                        <label className="flex items-center gap-2 text-sm font-bold text-white"><input type="checkbox" checked={Boolean(definition.paid)} onChange={(event) => updateApplicationDefinition(appIndex, { paid: event.target.checked })} className="accent-[var(--red-primary)]" /> Paid</label>
                      </div>
                    </div>
                    <div className="mt-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Questions</h3>
                        <button onClick={() => addApplicationQuestion(appIndex)} className="btn-ghost !py-2 !px-3 !text-[10px]"><Plus size={11} /> Add Question</button>
                      </div>
                      {definition.questions.map((question, questionIndex) => (
                        <div key={question.id} className="border border-white/5 bg-[rgba(0,0,0,0.45)] p-4" style={chamferStyle}>
                          <div className="grid gap-3 md:grid-cols-2">
                            <Field label="Question"><input value={question.label} onChange={(event) => updateApplicationQuestion(appIndex, questionIndex, { label: event.target.value })} className={inputClass} /></Field>
                            <Field label="Type"><CustomSelect options={questionTypeOptions} value={question.type} onChange={(value) => updateApplicationQuestion(appIndex, questionIndex, { type: value as ApplicationQuestionType })} /></Field>
                            <Field label="Hint"><input value={question.hint} onChange={(event) => updateApplicationQuestion(appIndex, questionIndex, { hint: event.target.value })} className={inputClass} /></Field>
                            <Field label="Options">
                              <input value={question.options.join(', ')} onChange={(event) => updateApplicationQuestion(appIndex, questionIndex, { options: event.target.value.split(',').map((option) => option.trim()).filter(Boolean) })} placeholder="Comma separated options" className={inputClass} />
                            </Field>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs font-bold text-white"><input type="checkbox" checked={question.required} onChange={(event) => updateApplicationQuestion(appIndex, questionIndex, { required: event.target.checked })} className="accent-[var(--red-primary)]" /> Required</label>
                            <button onClick={() => removeApplicationQuestion(appIndex, questionIndex)} className="btn-outline-red !py-2 !px-3 !text-[10px]"><Trash2 size={11} /> Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex justify-end">
                      <button onClick={() => removeApplicationDefinition(appIndex)} className="btn-outline-red"><Trash2 size={12} /> Delete Application</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="eyebrow">Submissions</div>
                <h2 className="pulse-heading mt-2 text-3xl text-white">Submitted Applications</h2>
              </div>
              {applications.length === 0 && <div className={`${panelClass} text-center font-mono text-[11px] uppercase tracking-[0.25em] text-white/40`}>No applications yet.</div>}
              {applications.map((record) => (
                <article key={record.id} className={panelClass}>
                  <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--red-bright)]">{record.typeLabel}</div>
                      <div className="mt-1 text-lg font-bold text-white">{record.username}</div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Submitted {new Date(record.submittedAt).toLocaleString()}</div>
                    </div>
                    <StatusBadge status={record.status} />
                  </header>
                  <dl className="mt-4 grid gap-2 text-sm">
                    {Object.entries(record.answers).map(([question, answer]) => (
                      <div key={question} className="border border-white/10 bg-[rgba(0,0,0,0.4)] p-3" style={chamferStyle}>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">{getApplicationQuestionLabel(record, question)}</dt>
                        <dd className="mt-2 text-white/85">{Array.isArray(answer) ? answer.join(', ') : answer}</dd>
                      </div>
                    ))}
                  </dl>
                  <footer className="mt-5 flex flex-wrap justify-end gap-2">
                    <button onClick={() => setApplicationStatus(record.id, 'pending')} className="btn-ghost">Mark Pending</button>
                    <button onClick={() => setApplicationStatus(record.id, 'denied')} className="btn-outline-red"><X size={12} /> Deny</button>
                    <button onClick={() => setApplicationStatus(record.id, 'approved')} className="btn-primary"><Check size={12} /> Approve</button>
                  </footer>
                </article>
              ))}
            </div>
          </section>
        )}
        </main>
      </div>
      {ticketDeleteId && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md border border-white/10 bg-[rgba(8,8,8,0.95)] p-7 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_60px_-15px_rgba(220,38,38,0.4)]" style={chamferStyle}>
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center bg-[rgba(220,38,38,0.15)] ring-1 ring-[rgba(220,38,38,0.4)] text-[var(--red-bright)]" style={chamferStyle}><Trash2 size={18} /></div>
              <div>
                <h2 className="font-['TT_Octosquares',sans-serif] text-xl font-bold uppercase tracking-wide text-white">Delete support ticket?</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">This will permanently delete the ticket and all chat messages. This action cannot be undone.</p>
              </div>
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button disabled={busy} onClick={() => setTicketDeleteId('')} className="btn-ghost disabled:opacity-60">Cancel</button>
              <button disabled={busy} onClick={() => deleteSupportTicketFromAdmin(ticketDeleteId)} className="btn-primary disabled:opacity-60"><Trash2 size={12} /> Delete Ticket</button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[120] w-80 border border-[rgba(220,38,38,0.4)] bg-[rgba(8,8,8,0.95)] px-5 py-4 backdrop-blur-2xl shadow-[0_18px_50px_rgba(0,0,0,0.7),0_0_40px_-10px_rgba(220,38,38,0.5)]" style={chamferStyle}>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[var(--red-bright)] shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            <span className="font-['TT_Octosquares',sans-serif] text-sm font-semibold text-white">{toast}</span>
          </div>
        </div>
      )}
    </section>
  );
}

const chamferStyle: React.CSSProperties = { clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' };
const panelClass = 'chamfer-frame relative space-y-5 p-7 backdrop-blur-xl';
const hintClass = 'chamfer-frame-sm p-4 text-[12px] leading-6 text-white/65';
const inputClass = 'w-full border border-white/10 bg-[rgba(0,0,0,0.5)] p-3 text-sm text-white outline-none transition-colors duration-300 focus:border-[rgba(220,38,38,0.6)]';
const iconBtnClass = 'grid h-10 w-10 place-items-center border border-white/10 bg-[rgba(8,8,8,0.85)] text-[var(--red-bright)] transition-all duration-300 hover:border-[rgba(220,38,38,0.5)] hover:text-white';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">{label}</div>
      {children}
    </div>
  );
}

function SaveBar({ onSave, busy }: { onSave: () => void; busy: boolean }) {
  return (
    <div className="flex justify-end pt-2">
      <button disabled={busy} onClick={onSave} className="btn-primary disabled:opacity-60"><Save size={12} /> Save Changes</button>
    </div>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const map: Record<ApplicationStatus, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'border-amber-400/40 bg-amber-400/10 text-amber-300' },
    approved: { label: 'Approved', className: 'border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.1)] text-[var(--online-green)]' },
    denied: { label: 'Denied', className: 'border-[rgba(220,38,38,0.4)] bg-[rgba(220,38,38,0.1)] text-[var(--red-bright)]' }
  };
  const entry = map[status];
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] ${entry.className}`}>{entry.label}</span>;
}
