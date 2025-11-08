import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;   // Application ID (portal Discord)
const guildId = process.env.GUILD_ID;     // ID de ton serveur (optionnel mais + rapide)

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Répond Pong!')
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

async function register() {
  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
  } else {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
  }
  console.log('✅ Slash commands enregistrées');
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once('ready', () => console.log(`✅ Connecté comme ${client.user.tag}`));

client.on('interactionCreate', async i => {
  if (!i.isChatInputCommand()) return;
  if (i.commandName === 'ping') await i.reply('Pong!');
});

register().then(() => client.login(token)).catch(console.error);
