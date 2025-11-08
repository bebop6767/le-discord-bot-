// ---- Import des modules ----
import express from "express";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";

// ---- Variables d'environnement ----
const token = process.env.DISCORD_TOKEN; // Token de ton bot
const clientId = process.env.CLIENT_ID;  // Application ID
const guildId = process.env.GUILD_ID;    // ID de ton serveur (optionnel)

// ---- Petit serveur web (utile pour Koyeb) ----
const app = express();
app.get("/", (req, res) => res.send("Bot Discord en ligne ✅"));
app.listen(process.env.PORT || 3000, () => console.log("🌐 Serveur web actif"));

// ---- Définition d'une commande slash simple ----
const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Répond avec Pong!")
].map(cmd => cmd.toJSON());

// ---- Enregistrement des commandes slash ----
const rest = new REST({ version: "10" }).setToken(token);

async function registerCommands() {
  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log("✅ Commandes enregistrées pour le serveur (rapide)");
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log("✅ Commandes enregistrées globalement (peut prendre quelques minutes)");
    }
  } catch (error) {
    console.error("Erreur d’enregistrement :", error);
  }
}

// ---- Configuration du bot Discord ----
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`🤖 Connecté en tant que ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("🏓 Pong !");
  }
});

// ---- Lancement ----
registerCommands().then(() => client.login(token));
