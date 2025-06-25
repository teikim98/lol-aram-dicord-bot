import { client, rest } from './bot/client.js';
import { config, validateEnv } from './utils/config.js';
import { commands } from './bot/commands/index.js';
import { Routes } from 'discord.js';

console.log("봇 시작!");

// 환경변수 검증
try {
    validateEnv();
    console.log("환경변수 확인 완료!");
} catch (error) {
    console.error(error);
    process.exit(1);
}

// 명령어 등록 함수
async function registerCommands() {
    try {
        console.log('슬래시 명령어 등록 중...');
        
        // commands 배열에서 data만 추출
        const commandData = commands.map(cmd => cmd.data);
        
        await rest.put(
            Routes.applicationCommands(config.clientId!),
            { body: commandData }
        );
        
        console.log(`${commands.length}개의 슬래시 명령어 등록 완료!`);
    } catch (error) {
        console.error('명령어 등록 실패:', error);
    }
}

// 봇이 준비되었을 때
client.once('ready', () => {
    console.log('봇이 온라인 상태입니다!');
    console.log(`로그인됨: ${client.user?.tag}`);
});

// 슬래시 명령어 처리
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = commands.find(cmd => cmd.data.name === interaction.commandName);
    
    if (!command) {
        console.error(`명령어를 찾을 수 없음: ${interaction.commandName}`);
        return;
    }
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('명령어 실행 중 오류:', error);
        await interaction.reply({ 
            content: '명령어 실행 중 오류가 발생했습니다.', 
            ephemeral: true 
        });
    }
});

// 봇 시작
async function start() {
    await registerCommands();
    await client.login(config.token);
}

start();