const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const GUILD_ID = "1432695484384018565";
const VOICE_CHANNEL_ID = "1432695485864349851";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once('ready', async () => {
    console.log(`✅ Login sebagai ${client.user.tag}`);

    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return console.error("Guild tidak ditemukan.");

    const connection = joinVoiceChannel({
        channelId: VOICE_CHANNEL_ID,
        guildId: GUILD_ID,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false, // supaya bot musik bisa detect
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(path.join(__dirname, 'silent.mp3'));

    // mainkan audio pertama kali
    player.play(resource);
    connection.subscribe(player);

    // loop audio ketika idle
    player.on(AudioPlayerStatus.Idle, () => {
        player.play(resource);
        console.log('🔁 Silent audio diulang untuk tetap stay.');
    });

    player.on(AudioPlayerStatus.Playing, () => {
        console.log('🎧 Bot sedang memutar audio (silent).');
    });

    player.on('error', (error) => {
        console.error('❌ Terjadi kesalahan audio:', error);
    });
});

client.login(TOKEN);
