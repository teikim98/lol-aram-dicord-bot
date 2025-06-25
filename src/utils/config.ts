export const config = {
    token: process.env.DISCORD_TOKEN || '',
    clientId: process.env.DISCORD_CLIENT_ID || '',
    guildId: process.env.DISCORD_GUILD_ID || '',
}

export function validateEnv() {
    if(!config.token) {
        throw new Error("DISCORD_TOKEN이 설정되지 않았습니다. .env 파일을 확인하세요.");
    }
    if(!config.clientId) {
        throw new Error("DISCORD_CLIENT_ID가 설정되지 않았습니다. .env 파일을 확인하세요.");
    }
}