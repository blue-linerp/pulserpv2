import { redirect } from 'next/navigation';

export default async function ApplicationFormRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/applications?dept=${slug}`);
}
