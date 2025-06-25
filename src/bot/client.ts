import { Client, GatewayIntentBits, REST } from 'discord.js';

// Discord 클라이언트 생성
export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

// REST API 클라이언트 (명령어 등록용)
export const rest = new REST({ version: '10' }).setToken(
    process.env.DISCORD_TOKEN!
);