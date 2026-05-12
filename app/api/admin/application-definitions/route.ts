import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { listApplicationDefinitions, saveApplicationDefinitions, type ApplicationDefinition } from '@/lib/application-definitions';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  return NextResponse.json({ definitions: listApplicationDefinitions() });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const definitions = Array.isArray(body.definitions) ? body.definitions as ApplicationDefinition[] : [];
  const cleaned = definitions.map((definition) => ({
    ...definition,
    id: definition.id || definition.slug || `app_${Date.now()}`,
    slug: (definition.slug || definition.title || 'application').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    enabled: definition.enabled !== false,
    questions: Array.isArray(definition.questions) ? definition.questions : []
  }));
  saveApplicationDefinitions(cleaned);
  return NextResponse.json({ definitions: cleaned });
}
