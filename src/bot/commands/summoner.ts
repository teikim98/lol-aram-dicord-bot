import { ChatInputCommandInteraction, SlashCommandBuilder,EmbedBuilder } from 'discord.js';
import { getSummonerByRiotId } from '../../api/riot';
import type { Command } from '../../types';

export const summonerCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('소환사')
        .setDescription('소환사 정보를 조회합니다')
        .addStringOption(option =>
            option.setName('닉네임')
                .setDescription('게임네임#태그라인 (예: Hide on bush#KR1)')
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const riotId = interaction.options.getString('닉네임', true);

        const [gameName, tagLine] = riotId.split('#');

        if (!gameName || !tagLine) {
            await interaction.reply('❌ 올바른 형식으로 입력해주세요! (예: Hide on bush#KR1)');
            return;
        }

        await interaction.deferReply();

        try {
            const summoner = await getSummonerByRiotId(gameName, tagLine);

            // Embed 생성
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)  // 파란색
                .setTitle(`${gameName}#${tagLine}`)
                .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${summoner.profileIconId}.png`)
                .addFields(
                    { name: '레벨', value: `${summoner.summonerLevel}`, inline: true },
                    { name: '서버', value: 'KR', inline: true }
                )
                .setFooter({ text: 'LoL ARAM Stats' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply('❌ 소환사를 찾을 수 없습니다.');
        }
    }

};