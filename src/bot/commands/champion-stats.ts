import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getSummonerByRiotId, getChampionStats } from '../../api/riot';
import { getChampionNameKR } from '../../api/data-dragon';
import type { Command } from '../../types';

export const championStatsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('챔피언')
    .setDescription('ARAM 챔피언별 통계를 조회합니다')
    .addStringOption(option => 
      option.setName('닉네임')
        .setDescription('게임네임#태그라인 (예: Hide on bush#KR1)')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('게임수')
        .setDescription('분석할 게임 수 (기본: 50게임)')
        .setRequired(false)
        .setMinValue(10)
        .setMaxValue(99)
    ),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const riotId = interaction.options.getString('닉네임', true);
    const gameCount = interaction.options.getInteger('게임수') || 50;
    
    const [gameName, tagLine] = riotId.split('#');
    
    if (!gameName || !tagLine) {
      await interaction.reply('❌ 올바른 형식으로 입력해주세요! (예: Hide on bush#KR1)');
      return;
    }
    
    await interaction.deferReply();
    
    try {
      // 1. 소환사 정보 조회
      const summoner = await getSummonerByRiotId(gameName, tagLine);
      
      // 2. 챔피언 통계 조회
      const stats = await getChampionStats(summoner.puuid, gameCount);
      
      if (stats.totalGames === 0) {
        await interaction.editReply('최근 ARAM 전적이 없습니다.');
        return;
      }
      
      // 3. 한글 챔피언 이름 변환
      for (const stat of stats.mostPlayed) {
        stat.championNameKR = await getChampionNameKR(stat.championName);
      }
      for (const stat of stats.highestWinRate) {
        stat.championNameKR = await getChampionNameKR(stat.championName);
      }
      
      // 4. Embed 생성
      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${gameName}#${tagLine}의 ARAM 챔피언 통계`)
        .setDescription(`최근 ${stats.totalGames}게임 분석 | ${stats.uniqueChampions}개 챔피언 플레이`)
        .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${summoner.profileIconId}.png`)
        .setFooter({ text: 'LoL ARAM Stats' })
        .setTimestamp();
      
      // 5. 가장 많이 플레이한 챔피언 TOP 5
      let mostPlayedText = '';
      stats.mostPlayed.forEach((champ, index) => {
        const winRate = champ.winRate.toFixed(1);
        const kda = champ.averageKDA.toFixed(2);
        mostPlayedText += `${index + 1}. **${champ.championNameKR}** - ${champ.games}게임 (${winRate}% | KDA ${kda})\n`;
      });
      
      embed.addFields({
        name: '🎮 가장 많이 플레이한 챔피언',
        value: mostPlayedText || '데이터 없음',
        inline: false
      });
      
      // 6. 승률 높은 챔피언 TOP 5 (3게임 이상)
      let highWinRateText = '';
      stats.highestWinRate.forEach((champ, index) => {
        const winRate = champ.winRate.toFixed(1);
        highWinRateText += `${index + 1}. **${champ.championNameKR}** - ${winRate}% (${champ.wins}승 ${champ.losses}패)\n`;
      });
      
      embed.addFields({
        name: '🏆 승률 높은 챔피언 (3게임 이상)',
        value: highWinRateText || '데이터 없음',
        inline: false
      });
      
      await interaction.editReply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Error fetching champion stats:', error);
      await interaction.editReply('❌ 챔피언 통계 조회 중 오류가 발생했습니다.');
    }
  }
};