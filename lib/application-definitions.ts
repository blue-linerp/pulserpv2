import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { applicationTypes } from './data';
import { hasSupabaseStorage, readStorageValue, writeStorageValue } from './supabase-storage';
import type { ApplicationDefinition, ApplicationQuestion } from './application-types';
export type { ApplicationDefinition, ApplicationQuestion, ApplicationQuestionType } from './application-types';

const dataDir = path.join(process.cwd(), 'data');
const definitionsFile = path.join(dataDir, 'application-definitions.json');

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

const defaultQuestions: ApplicationQuestion[] = [
  { id: 'banned', label: 'Have you ever been banned, on this server or others at any time and why?', hint: 'Be truthful, we will check. Name the servers and the rule breaks.', type: 'richtext', required: true, options: [] },
  { id: 'staff-work', label: 'What work do you want to do as staff?', hint: 'Please Select one or all.', type: 'checkboxes', required: true, options: ['Player Reports', 'Player Event Help', 'Event Creation', 'Discord Moderation', 'Other'] },
  { id: 'experience', label: 'Experience?', hint: 'Please mention RP community management, GTA Administration, customer support, Forum/Discord moderation.', type: 'richtext', required: true, options: [] },
  { id: 'motivation', label: 'Why do you want to be Pulse RP staff?', hint: 'Explain in detail your motivations and the value you bring.', type: 'richtext', required: true, options: [] },
  { id: 'impartiality', label: "How important is 'impartiality' in reports?", hint: 'Explain in your own words.', type: 'richtext', required: true, options: [] },
  { id: 'availability', label: 'What is your availability?', hint: 'How many hours are you EU/AU/NA? What times exactly are you around in your time zone.', type: 'richtext', required: true, options: [] },
  { id: 'characters', label: 'Who do you play on our server?', hint: 'Tell us about all the characters you play on our servers. Are they in a Gov job? A gang? Or do they simply live the civilian lifestyle?', type: 'richtext', required: true, options: [] },
  { id: 'acknowledgement', label: 'Acknowledgement', hint: 'Do you acknowledge that upon acceptance you may be required to sign a Non-Disclosure Agreement and legally binding contract?', type: 'select', required: true, options: ['Yes, I understand!', 'No'] }
];

export const defaultApplicationDefinitions: ApplicationDefinition[] = applicationTypes.map((item) => ({
  id: item.slug,
  slug: item.slug,
  title: item.title,
  description: item.description,
  enabled: true,
  paid: Boolean(item.paid),
  questions: defaultQuestions
}));

export function listApplicationDefinitions(): ApplicationDefinition[] {
  ensureDir();
  if (!fs.existsSync(definitionsFile)) {
    fs.writeFileSync(definitionsFile, JSON.stringify(defaultApplicationDefinitions, null, 2));
    return defaultApplicationDefinitions;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(definitionsFile, 'utf8')) as ApplicationDefinition[];
    return parsed.map((definition) => ({ ...definition, questions: definition.questions || [] }));
  } catch {
    return defaultApplicationDefinitions;
  }
}

export function saveApplicationDefinitions(definitions: ApplicationDefinition[]) {
  ensureDir();
  fs.writeFileSync(definitionsFile, JSON.stringify(definitions, null, 2));
}

export async function saveApplicationDefinitionsAsync(definitions: ApplicationDefinition[]) {
  if (!hasSupabaseStorage()) {
    saveApplicationDefinitions(definitions);
    return;
  }
  await writeStorageValue('application-definitions', definitions);
}

export function getApplicationDefinition(slug: string) {
  return listApplicationDefinitions().find((definition) => definition.slug === slug) || null;
}

export async function getApplicationDefinitionAsync(slug: string) {
  return listApplicationDefinitions().find((definition) => definition.slug === slug) || null;
}
