import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { isAdmin } from '@/lib/admin';

const allowedMime = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'];

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get('file');
  const target = (formData.get('target') as string) || 'logo';

  if (!(file instanceof File)) return NextResponse.json({ error: 'no_file' }, { status: 400 });
  if (!allowedMime.includes(file.type)) return NextResponse.json({ error: 'bad_type', type: file.type }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'too_large' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const extFromName = path.extname(file.name).toLowerCase();
  const ext = extFromName || (file.type === 'image/svg+xml' ? '.svg' : file.type === 'image/png' ? '.png' : file.type === 'image/jpeg' ? '.jpg' : '.bin');
  const safeTarget = target.replace(/[^a-z0-9-_]/gi, '');
  const fileName = `${safeTarget || 'upload'}-${Date.now()}${ext}`;
  fs.writeFileSync(path.join(uploadsDir, fileName), buffer);

  return NextResponse.json({ url: `/uploads/${fileName}` });
}
