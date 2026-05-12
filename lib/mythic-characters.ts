import 'server-only';
import { MongoClient, type Filter } from 'mongodb';

export type MythicCharacter = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  cash: number | null;
  bank: number | null;
  job: string;
  lastPlayed: string;
};

type RawCharacter = Record<string, unknown>;

function value(row: RawCharacter, keys: string[]) {
  for (const key of keys) {
    const next = row[key];
    if (next !== undefined && next !== null && next !== '') return next;
  }
  return null;
}

function parseNumber(input: unknown) {
  if (typeof input === 'number') return input;
  if (typeof input === 'string' && input.trim()) {
    const parsed = Number(input);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function formatMythicDate(input: unknown) {
  const value = parseNumber(input);
  if (!value) return 'Unknown';
  const milliseconds = value > 10_000_000_000 ? value : value * 1000;
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(milliseconds));
}

function formatGender(input: unknown) {
  if (input === 0 || input === '0') return 'Male';
  if (input === 1 || input === '1') return 'Female';
  if (input === true || input === 'true') return 'Female';
  if (input === false || input === 'false') return 'Male';
  if (typeof input === 'string' && input.toLowerCase() === 'm') return 'Male';
  if (typeof input === 'string' && input.toLowerCase() === 'f') return 'Female';
  if (typeof input === 'string' && input.toLowerCase() === 'male') return 'Male';
  if (typeof input === 'string' && input.toLowerCase() === 'female') return 'Female';
  return String(input || 'Unknown');
}

function formatJob(input: unknown) {
  if (Array.isArray(input)) {
    const primary = input.find((job) => job && typeof job === 'object' && (job as RawCharacter).Workplace) || input[0];
    if (primary && typeof primary === 'object') {
      const job = primary as RawCharacter;
      const workplace = job.Workplace && typeof job.Workplace === 'object' ? job.Workplace as RawCharacter : null;
      const grade = job.Grade && typeof job.Grade === 'object' ? job.Grade as RawCharacter : null;
      return [workplace?.Name, job.Name, grade?.Name].filter(Boolean).join(' · ');
    }
  }
  if (input && typeof input === 'object') {
    const job = input as RawCharacter;
    return String(job.Name || job.name || job.label || 'Unemployed');
  }
  return String(input || 'Unemployed');
}

function parseCharacterData(row: RawCharacter) {
  const raw = value(row, ['data', 'Data', 'charinfo', 'metadata', 'info']);
  if (typeof raw !== 'string') return {} as RawCharacter;
  try {
    return JSON.parse(raw) as RawCharacter;
  } catch {
    return {} as RawCharacter;
  }
}

function nestedValue(row: RawCharacter, path: string) {
  return path.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') return null;
    return (current as RawCharacter)[key];
  }, row);
}

function valueDeep(row: RawCharacter, keys: string[]) {
  for (const key of keys) {
    const next = key.includes('.') ? nestedValue(row, key) : row[key];
    if (next !== undefined && next !== null && next !== '') return next;
  }
  return null;
}

function normalizeCharacter(row: RawCharacter): MythicCharacter {
  const data = parseCharacterData(row);
  const money = typeof data.money === 'object' && data.money ? data.money as RawCharacter : {};
  const jobData = typeof data.job === 'object' && data.job ? data.job as RawCharacter : {};
  const firstName = String(valueDeep(row, ['first_name', 'firstname', 'First', 'firstName']) || value(data, ['first_name', 'firstname', 'First', 'firstName']) || 'Unknown');
  const lastName = String(valueDeep(row, ['last_name', 'lastname', 'Last', 'lastName']) || value(data, ['last_name', 'lastname', 'Last', 'lastName']) || 'Character');

  return {
    id: String(valueDeep(row, ['id', 'sid', 'SID', 'character_id', 'charid', '_id']) || `${firstName}-${lastName}`),
    firstName,
    lastName,
    gender: formatGender(valueDeep(row, ['gender', 'Gender', 'sex', 'Sex']) ?? value(data, ['gender', 'Gender', 'sex', 'Sex'])),
    dateOfBirth: formatMythicDate(valueDeep(row, ['dob', 'DOB', 'dateofbirth', 'birthdate']) || value(data, ['dob', 'dateofbirth', 'birthdate'])),
    phone: String(valueDeep(row, ['phone', 'Phone', 'phone_number']) || value(data, ['phone', 'phone_number']) || 'Unknown'),
    cash: parseNumber(valueDeep(row, ['cash', 'Cash']) || value(money, ['cash'])),
    bank: parseNumber(valueDeep(row, ['bank', 'Bank', 'BankAccount.Balance', 'BankAccount']) || value(money, ['bank'])),
    job: formatJob(valueDeep(row, ['job', 'Job', 'Jobs', 'job_name']) || jobData),
    lastPlayed: formatMythicDate(valueDeep(row, ['last_played', 'lastPlayed', 'updated_at', 'LastPlayed']))
  };
}

export async function getMythicCharacters(steamId: string, username?: string): Promise<MythicCharacter[]> {
  const databaseUrl = process.env.MYTHIC_MONGODB_URI || process.env.MONGODB_URI;
  if (!databaseUrl) return [];

  const databaseName = process.env.MYTHIC_MONGODB_DB || 'mythic';
  const collectionName = process.env.MYTHIC_CHARACTERS_COLLECTION || 'characters';
  const usersDatabaseName = process.env.MYTHIC_USERS_DB || 'auth';
  const usersCollectionName = process.env.MYTHIC_USERS_COLLECTION || 'users';
  const configuredIdentifierFields = (process.env.MYTHIC_IDENTIFIER_FIELD || 'owner')
    .split(',')
    .map((field) => field.trim())
    .filter(Boolean);
  const identifierFields = Array.from(new Set([
    ...configuredIdentifierFields,
    'owner',
    'Owner',
    'license',
    'License',
    'steam',
    'steamId',
    'steamID',
    'SteamID',
    'identifier',
    'Identifier',
    'identifiers',
    'Identifiers',
    'user',
    'User',
    'account',
    'Account',
    'source',
    'Source',
    'data.owner',
    'data.Owner',
    'data.license',
    'data.steam',
    'data.identifiers',
    'Identifiers.steam',
    'identifiers.steam'
  ]));
  const steamIdentifier = steamId.startsWith('steam:') ? steamId : `steam:${BigInt(steamId).toString(16)}`;
  const identifierValues: Array<string | number> = [steamId, steamIdentifier, `steam:${steamId}`];

  let client: MongoClient | null = null;
  try {
    client = new MongoClient(databaseUrl);
    await client.connect();
    const charactersDb = client.db(databaseName);
    const usersDb = client.db(usersDatabaseName);
    const userRecord = await usersDb
      .collection(usersCollectionName)
      .findOne({
        $or: [
          { identifier: { $in: identifierValues } },
          { Identifier: { $in: identifierValues } },
          { identifiers: { $in: identifierValues } },
          { tokens: { $in: identifierValues } },
          ...(username ? [{ name: username }, { Name: username }] : [])
        ]
      }) as RawCharacter | null;
    const accountId = userRecord ? valueDeep(userRecord, ['account', 'Account', 'id', '_id']) : null;
    const query: Filter<RawCharacter> = accountId
      ? { $or: [{ User: accountId }, { user: accountId }, { owner: accountId }, ...identifierFields.map((field) => ({ [field]: { $in: identifierValues } }))] }
      : { $or: identifierFields.map((field) => ({ [field]: { $in: identifierValues } })) };
    const characters = await charactersDb
      .collection(collectionName)
      .find(query)
      .toArray();
    return (characters as RawCharacter[]).map(normalizeCharacter);
  } catch (error) {
    console.warn('[mythic-characters] Unable to fetch characters', error);
    return [];
  } finally {
    await client?.close().catch(() => null);
  }
}
