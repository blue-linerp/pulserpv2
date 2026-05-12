const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...valueParts] = trimmed.split('=');
    if (!process.env[key]) process.env[key] = valueParts.join('=').replace(/^['"]|['"]$/g, '');
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;
const clientId = process.env.DISCORD_CLIENT_ID;

const roleIds = {
  admin: process.env.DISCORD_ROLE_ADMIN_ID,
  dev: process.env.DISCORD_ROLE_DEV_ID,
  staff: process.env.DISCORD_ROLE_STAFF_ID,
  member: process.env.DISCORD_ROLE_MEMBER_ID,
  allowlisted: process.env.DISCORD_ROLE_ALLOWLISTED_ID,
  bronze: process.env.DISCORD_ROLE_QUEUE_BRONZE_ID,
  gold: process.env.DISCORD_ROLE_QUEUE_GOLD_ID,
  diamond: process.env.DISCORD_ROLE_QUEUE_DIAMOND_ID
};

const roleChoices = [
  { name: 'Admin', value: 'admin' },
  { name: 'Dev', value: 'dev' },
  { name: 'Staff', value: 'staff' },
  { name: 'Member', value: 'member' },
  { name: 'Allowlisted / Whitelisted', value: 'allowlisted' },
  { name: 'Queue Priority: Bronze', value: 'bronze' },
  { name: 'Queue Priority: Gold', value: 'gold' },
  { name: 'Queue Priority: Diamond', value: 'diamond' }
];

function assertConfig() {
  const missing = [];
  if (!token) missing.push('DISCORD_BOT_TOKEN');
  if (!guildId) missing.push('DISCORD_GUILD_ID');
  if (!clientId || clientId === 'replace-me') missing.push('DISCORD_CLIENT_ID');
  for (const [key, value] of Object.entries(roleIds)) if (!value || value === 'replace-me') missing.push(`DISCORD_ROLE_${key.toUpperCase()}_ID`);
  if (missing.length) {
    console.error(`Missing Discord bot config: ${missing.join(', ')}`);
    process.exit(1);
  }
}

async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('syncrole')
      .setDescription('Sync one website permission role to a Discord member.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
      .addUserOption((option) => option.setName('user').setDescription('Discord user to update').setRequired(true))
      .addStringOption((option) => option.setName('role').setDescription('Website permission role').setRequired(true).addChoices(...roleChoices))
      .addBooleanOption((option) => option.setName('remove').setDescription('Remove this role instead of adding it')),
    new SlashCommandBuilder()
      .setName('syncpriority')
      .setDescription('Set a member queue priority role and remove other queue priority roles.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
      .addUserOption((option) => option.setName('user').setDescription('Discord user to update').setRequired(true))
      .addStringOption((option) => option.setName('tier').setDescription('Queue priority tier').setRequired(true).addChoices(
        { name: 'None', value: 'none' },
        { name: 'Bronze', value: 'bronze' },
        { name: 'Gold', value: 'gold' },
        { name: 'Diamond', value: 'diamond' }
      )),
    new SlashCommandBuilder()
      .setName('botstatus')
      .setDescription('Check PulseRP role sync bot status.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  ].map((command) => command.toJSON());

  const rest = new REST({ version: '10' }).setToken(token);
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
}

async function addOrRemoveRole(interaction, roleKey, remove = false) {
  const roleId = roleIds[roleKey];
  const member = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
  if (remove) await member.roles.remove(roleId);
  else await member.roles.add(roleId);
  await interaction.reply({ content: `${remove ? 'Removed' : 'Synced'} ${roleKey} role for ${member.user.tag}.`, ephemeral: true });
}

async function setPriority(interaction, tier) {
  const member = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
  const priorityRoleIds = [roleIds.bronze, roleIds.gold, roleIds.diamond].filter(Boolean);
  await member.roles.remove(priorityRoleIds);
  if (tier !== 'none') await member.roles.add(roleIds[tier]);
  await interaction.reply({ content: `Set queue priority for ${member.user.tag} to ${tier}.`, ephemeral: true });
}

async function main() {
  assertConfig();
  await registerCommands();

  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

  client.once('ready', () => {
    console.log(`PulseRP Discord bot online as ${client.user.tag}`);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    try {
      if (interaction.commandName === 'syncrole') {
        await addOrRemoveRole(interaction, interaction.options.getString('role'), interaction.options.getBoolean('remove') || false);
      }
      if (interaction.commandName === 'syncpriority') {
        await setPriority(interaction, interaction.options.getString('tier'));
      }
      if (interaction.commandName === 'botstatus') {
        await interaction.reply({ content: `PulseRP role sync bot is online. Managing ${Object.keys(roleIds).length} website roles.`, ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      const payload = { content: 'Role sync failed. Check bot permissions and role hierarchy.', ephemeral: true };
      if (interaction.replied || interaction.deferred) await interaction.followUp(payload);
      else await interaction.reply(payload);
    }
  });

  await client.login(token);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
