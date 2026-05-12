export type SupportTicketStatus = 'open' | 'pending' | 'closed';

export type SupportTicketMessage = {
  id: string;
  authorSteamId: string;
  authorName: string;
  authorRole: 'user' | 'admin';
  body: string;
  createdAt: number;
};

export type SupportTicket = {
  id: string;
  steamId: string;
  username: string;
  title: string;
  server: string;
  category: string;
  status: SupportTicketStatus;
  createdAt: number;
  updatedAt: number;
  messages: SupportTicketMessage[];
};
