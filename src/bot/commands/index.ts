import { pingCommand } from './ping.js';
import { summonerCommand } from './summoner.js';
import { aramStatsCommand } from './aram-stats.js';
import { championStatsCommand } from './champion-stats.js'; 


// 모든 명령어를 여기서 export
export const commands = [
    pingCommand,
    summonerCommand,
    aramStatsCommand,
    championStatsCommand,
];