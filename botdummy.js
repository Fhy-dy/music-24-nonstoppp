// botdummy.js
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType } = require('@discordjs/voice');
const path = require('path');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const GUILD_ID = "1432695484384018565";
const VOICE_CHANNEL_ID = "1432695485864349851";

// Membuat client Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

// Event login bot
client.once(Events.ClientReady, async () => {
    console.log(`✅ Login sebagai ${client.user.tag}`);

    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return console.error("Guild tidak ditemukan.");

    // Join ke voice channel
    const connection = joinVoiceChannel({
        channelId: VOICE_CHANNEL_ID,
        guildId: GUILD_ID,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
    });

    // Audio player & silent resource
    const player = createAudioPlayer();
    const resource = createAudioResource(path.join(__dirname, 'silent.mp3'), {
        inputType: StreamType.Arbitrary,
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
        console.log('🎧 Bot sedang memutar audio (silent).');
    });

    player.on('error', (error) => {
        console.error('❌ Terjadi kesalahan audio:', error);
    });
});

// Login bot
client.login(TOKEN);
