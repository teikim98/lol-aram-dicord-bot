import { Command } from '../../types/index.js';

export const pingCommand: Command = {
    data: {
        name: 'ping',
        description: '봇의 응답을 확인합니다'
    },
    execute: async (interaction) => {
        const latency = Date.now() - interaction.createdTimestamp;
        await interaction.reply(`퐁! 🏓 지연시간: ${latency}ms`);
    }
};