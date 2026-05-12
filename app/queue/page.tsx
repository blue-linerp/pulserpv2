import { QueueClient } from '@/components/QueueClient';
import { getServerStatuses } from '@/lib/fivem';
import { getSettings } from '@/lib/settings';

export default async function QueuePage() {
  const settings = getSettings();
  const servers = await getServerStatuses(settings.server.maxPlayers);
  return <QueueClient servers={servers} maxPlayers={settings.server.maxPlayers} />;
}
