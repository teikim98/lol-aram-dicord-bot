import { Client } from 'discord.js';

console.log("봇 시작!");

// 환경변수 확인
const token = process.env.DISCORD_TOKEN;
console.log("토큰 존재:", token ? "있음" : "없음");

// Discord 클라이언트 생성
const client = new Client({
    intents: ['Guilds', 'GuildMessages']
});


console.log("Discord 클라이언트 생성됨!");

// 봇이 준비되었을 때
client.once('ready', () => {
    console.log('봇이 온라인 상태입니다!');
    console.log(`로그인됨: ${client.user?.tag}`);
});

// 봇 로그인
if (token) {
    client.login(token)
        .then(() => console.log("Discord 로그인 시도 중..."))
        .catch(error => console.error("로그인 실패:", error));
} else {
    console.error("토큰이 없습니다! .env 파일을 확인하세요.");
}