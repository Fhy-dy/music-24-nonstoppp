const { Client, GatewayIntentBits } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType,
} = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

// Ambil variabel dari file .env
require('dotenv').config();
const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID || "1432695484384018565";
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID || "1432695485864349851";

// Buat client Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

// Event saat bot berhasil login
client.once('ready', async () => {
  console.log(`✅ Login sebagai ${client.user.tag}`);

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error("❌ Guild tidak ditemukan. Pastikan GUILD_ID benar.");
    return;
  }

  // Bergabung ke voice channel
  const connection = joinVoiceChannel({
    channelId: VOICE_CHANNEL_ID,
    guildId: GUILD_ID,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false,
  });

  // Gunakan ffmpeg-static untuk memutar silent.mp3
  const ffmpeg = spawn(ffmpegPath, [
    '-i', path.join(__dirname, 'silent.mp3'),
    '-f', 's16le',
    '-ar', '48000',
    '-ac', '2',
    'pipe:1'
  ]);

  const resource = createAudioResource(ffmpeg.stdout, {
    inputType: StreamType.Raw,
  });

  const player = createAudioPlayer();
  player.play(resource);
  connection.subscribe(player);

  player.on(AudioPlayerStatus.Playing, () => {
    console.log('🎧 Bot sedang memutar audio (silent).');
  });

  player.on('error', (error) => {
    console.error('❌ Terjadi kesalahan audio:', error);
  });
});

// Jalankan bot
client.login(TOKEN);
