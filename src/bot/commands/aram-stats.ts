import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getSummonerByRiotId, getRecentAramStats } from '../../api/riot';
import { getChampionNameKR } from '../../api/data-dragon';  // 추가
import type { Command } from '../../types';

export const aramStatsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('전적')
    .setDescription('최근 ARAM 전적을 조회합니다')
    .addStringOption(option => 
      option.setName('닉네임')
        .setDescription('게임네임#태그라인 (예: Hide on bush#KR1)')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('게임수')
        .setDescription('조회할 게임 수 (기본: 10게임)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(20)
    ),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const riotId = interaction.options.getString('닉네임', true);
    const gameCount = interaction.options.getInteger('게임수') || 10;
    
    const [gameName, tagLine] = riotId.split('#');
    
    if (!gameName || !tagLine) {
      await interaction.reply('❌ 올바른 형식으로 입력해주세요! (예: Hide on bush#KR1)');
      return;
    }
    
    await interaction.deferReply();
    
    try {
      // 1. 소환사 정보 조회
      const summoner = await getSummonerByRiotId(gameName, tagLine);
      
      // 2. ARAM 전적 조회
      const stats = await getRecentAramStats(summoner.puuid, gameCount);
      
      if (stats.matches.length === 0) {
        await interaction.editReply('최근 ARAM 전적이 없습니다.');
        return;
      }
      
      // 3. Embed 생성
      const embed = new EmbedBuilder()
        .setColor(stats.summary.wins > stats.summary.losses ? 0x00FF00 : 0xFF0000)
        .setTitle(`${gameName}#${tagLine}의 최근 ARAM 전적`)
        .setDescription(`최근 ${stats.matches.length}게임: ${stats.summary.wins}승 ${stats.summary.losses}패`)
        .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${summoner.profileIconId}.png`)
        .setFooter({ text: 'LoL ARAM Stats' })
        .setTimestamp();
      
      // 4. 각 게임 정보 추가 (한글 챔피언 이름으로)
      for (const [index, match] of stats.matches.entries()) {
        const kda = match.deaths === 0 ? 'Perfect' : ((match.kills + match.assists) / match.deaths).toFixed(2);
        
        // 챔피언 이름을 한글로 변환
        const championNameKR = await getChampionNameKR(match.championName);
        
        embed.addFields({
          name: `게임 ${index + 1} - ${match.win ? '승리 🏆' : '패배 ❌'}`,
          value: `**${championNameKR}** | ${match.kills}/${match.deaths}/${match.assists} (KDA: ${kda})`,
          inline: false
        });
      }
      
      await interaction.editReply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Error fetching ARAM stats:', error);
      await interaction.editReply('❌ 전적 조회 중 오류가 발생했습니다.');
    }
  }
};