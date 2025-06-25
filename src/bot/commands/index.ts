import { pingCommand } from './ping.js';
import { summonerCommand } from './summoner.js';

// 모든 명령어를 여기서 export
export const commands = [
    pingCommand,
    summonerCommand  // 추가
];