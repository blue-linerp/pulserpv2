import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type { SupportTicket, SupportTicketStatus } from './support-ticket-types';
export type { SupportTicket, SupportTicketMessage, SupportTicketStatus } from './support-ticket-types';

const dataDir = process.env.VERCEL ? path.join('/tmp', 'pulserpwebsite-data') : path.join(process.cwd(), 'data');
const ticketsFile = path.join(dataDir, 'support-tickets.json');

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function saveTickets(tickets: SupportTicket[]) {
  ensureDir();
  fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));
}

export function listSupportTickets(): SupportTicket[] {
  ensureDir();
  if (!fs.existsSync(ticketsFile)) {
    fs.writeFileSync(ticketsFile, JSON.stringify([], null, 2));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(ticketsFile, 'utf8')) as SupportTicket[];
  } catch {
    return [];
  }
}

export function listUserSupportTickets(steamId: string) {
  return listSupportTickets().filter((ticket) => ticket.steamId === steamId);
}

export function getSupportTicket(id: string) {
  return listSupportTickets().find((ticket) => ticket.id === id) || null;
}

export function createSupportTicket(input: { steamId: string; username: string; title: string; server: string; category: string; body: string }) {
  const now = Date.now();
  const ticket: SupportTicket = {
    id: `ticket_${now}`,
    steamId: input.steamId,
    username: input.username,
    title: input.title,
    server: input.server,
    category: input.category,
    status: 'open',
    createdAt: now,
    updatedAt: now,
    messages: [{ id: `message_${now}`, authorSteamId: input.steamId, authorName: input.username, authorRole: 'user', body: input.body, createdAt: now }]
  };
  const tickets = [ticket, ...listSupportTickets()];
  saveTickets(tickets);
  return ticket;
}

export function addSupportTicketMessage(id: string, input: { authorSteamId: string; authorName: string; authorRole: 'user' | 'admin'; body: string }) {
  const now = Date.now();
  const tickets = listSupportTickets();
  let updated: SupportTicket | null = null;
  const next = tickets.map((ticket) => {
    if (ticket.id !== id) return ticket;
    updated = {
      ...ticket,
      status: input.authorRole === 'admin' ? 'pending' : 'open',
      updatedAt: now,
      messages: [...ticket.messages, { id: `message_${now}`, authorSteamId: input.authorSteamId, authorName: input.authorName, authorRole: input.authorRole, body: input.body, createdAt: now }]
    };
    return updated;
  });
  saveTickets(next);
  return updated;
}

export function updateSupportTicketStatus(id: string, status: SupportTicketStatus) {
  const tickets = listSupportTickets();
  let updated: SupportTicket | null = null;
  const next = tickets.map((ticket) => {
    if (ticket.id !== id) return ticket;
    updated = { ...ticket, status, updatedAt: Date.now() };
    return updated;
  });
  saveTickets(next);
  return updated;
}
export function deleteSupportTicket(id: string) {
  const tickets = listSupportTickets();
  const next = tickets.filter((ticket) => ticket.id !== id);
  if (next.length === tickets.length) return false;
  saveTickets(next);
  return true;
}
