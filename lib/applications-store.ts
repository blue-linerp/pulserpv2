import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { hasSupabaseStorage, readStorageValue, writeStorageValue } from './supabase-storage';

export type ApplicationStatus = 'pending' | 'approved' | 'denied';

export type ApplicationRecord = {
  id: string;
  steamId: string;
  username: string;
  type: string;
  typeLabel: string;
  submittedAt: number;
  status: ApplicationStatus;
  answers: Record<string, string | string[]>;
  reviewerNote?: string;
};

const dataDir = path.join(process.cwd(), 'data');
const applicationsFile = path.join(dataDir, 'applications.json');

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

const sample: ApplicationRecord[] = [
  {
    id: 'app_001',
    steamId: '76561198000000001',
    username: 'CrimsonRP',
    type: 'allowlist',
    typeLabel: 'FiveM Allowlist Application',
    submittedAt: Date.now() - 1000 * 60 * 60 * 6,
    status: 'pending',
    answers: { 'Have you ever been banned?': 'No.', 'Experience?': 'Active in two RP servers for 2 years.' }
  },
  {
    id: 'app_002',
    steamId: '76561198000000002',
    username: 'NorthSideMedic',
    type: 'staff-public',
    typeLabel: 'FiveM Staff Application (Public)',
    submittedAt: Date.now() - 1000 * 60 * 60 * 26,
    status: 'pending',
    answers: { 'Why do you want to be Pulse RP staff?': 'I want to help newcomers and grow the city.' }
  }
];

export function listApplications(): ApplicationRecord[] {
  ensureDir();
  if (!fs.existsSync(applicationsFile)) {
    fs.writeFileSync(applicationsFile, JSON.stringify(sample, null, 2));
    return sample;
  }
  try {
    return JSON.parse(fs.readFileSync(applicationsFile, 'utf8')) as ApplicationRecord[];
  } catch {
    return [];
  }
}

export async function listApplicationsAsync(): Promise<ApplicationRecord[]> {
  if (!hasSupabaseStorage()) return listApplications();
  return readStorageValue('applications', listApplications());
}

export function saveApplications(records: ApplicationRecord[]) {
  ensureDir();
  fs.writeFileSync(applicationsFile, JSON.stringify(records, null, 2));
}

export async function saveApplicationsAsync(records: ApplicationRecord[]) {
  if (!hasSupabaseStorage()) {
    saveApplications(records);
    return;
  }
  await writeStorageValue('applications', records);
}

export function createApplication(record: Omit<ApplicationRecord, 'id' | 'submittedAt' | 'status'>) {
  const records = listApplications();
  const next: ApplicationRecord = {
    ...record,
    id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    submittedAt: Date.now(),
    status: 'pending'
  };
  saveApplications([next, ...records]);
  return next;
}

export async function createApplicationAsync(record: Omit<ApplicationRecord, 'id' | 'submittedAt' | 'status'>) {
  const records = await listApplicationsAsync();
  const next: ApplicationRecord = {
    ...record,
    id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    submittedAt: Date.now(),
    status: 'pending'
  };
  await saveApplicationsAsync([next, ...records]);
  return next;
}

export function updateApplicationStatus(id: string, status: ApplicationStatus, reviewerNote?: string) {
  const records = listApplications();
  const next = records.map((record) => record.id === id ? { ...record, status, reviewerNote } : record);
  saveApplications(next);
  return next.find((record) => record.id === id) || null;
}

export async function updateApplicationStatusAsync(id: string, status: ApplicationStatus, reviewerNote?: string) {
  const records = await listApplicationsAsync();
  const next = records.map((record) => record.id === id ? { ...record, status, reviewerNote } : record);
  await saveApplicationsAsync(next);
  return next.find((record) => record.id === id) || null;
}
