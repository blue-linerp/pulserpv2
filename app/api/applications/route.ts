import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { getApplicationDefinition } from '@/lib/application-definitions';
import { createApplication } from '@/lib/applications-store';

export async function POST(request: NextRequest) {
  const user = await requireUser();
  const body = await request.json().catch(() => ({}));
  const slug = typeof body.slug === 'string' ? body.slug : '';
  const definition = getApplicationDefinition(slug);
  if (!definition || !definition.enabled) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  const answers = typeof body.answers === 'object' && body.answers ? body.answers : {};
  const missing = definition.questions.filter((question) => question.required).filter((question) => {
    const answer = answers[question.id];
    if (Array.isArray(answer)) return answer.length === 0;
    return typeof answer !== 'string' || answer.trim().length === 0;
  });
  if (missing.length) return NextResponse.json({ error: 'missing_required', fields: missing.map((question) => question.id) }, { status: 400 });
  const application = createApplication({
    steamId: user.steamId,
    username: user.username,
    type: definition.slug,
    typeLabel: definition.title,
    answers
  });
  return NextResponse.json({ application });
}
