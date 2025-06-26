# LoL ARAM Discord Bot 🎮

League of Legends ARAM 전용 Discord 봇으로, 소환사 정보 조회와 ARAM 통계를 제공합니다.

## 기능 ✨

- **`/ping`** - 봇 상태 확인 및 응답 시간 측정
- **`/소환사 [라이엇ID]`** - 소환사 정보 조회 (레벨, 프로필 아이콘, 서버 정보)

## 기술 스택 🛠

- **Runtime**: [Bun](https://bun.sh/) - 빠른 JavaScript 런타임
- **Language**: TypeScript
- **Bot Framework**: [discord.js](https://discord.js.org/) v14.14.1
- **APIs**: Discord API, Riot Games API

## 시작하기 🚀

### 필수 요구사항

- [Bun](https://bun.sh/) 설치
- Discord 봇 토큰 ([Discord Developer Portal](https://discord.com/developers/applications))
- Riot API 키 ([Riot Developer Portal](https://developer.riotgames.com/))

### 설치

1. 저장소 클론
```bash
git clone https://github.com/yourusername/lol-aram-discord-bot.git
cd lol-aram-discord-bot
```

2. 의존성 설치
```bash
bun install
```

3. 환경 변수 설정
```bash
cp .env.example .env
```

`.env` 파일을 열어 다음 값들을 설정:
```env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_application_id
RIOT_API_KEY=your_riot_api_key
```

4. 봇 실행
```bash
bun run dev
```

## 프로젝트 구조 📁

```
lol-aram-discord-bot/
├── src/
│   ├── index.ts          # 메인 진입점
│   ├── bot/
│   │   ├── client.ts     # Discord 클라이언트 설정
│   │   └── commands/     # 슬래시 명령어
│   │       ├── ping.ts   
│   │       └── summoner.ts
│   ├── api/
│   │   └── riot.ts       # Riot API 통합
│   ├── types/            # TypeScript 타입 정의
│   └── utils/
│       └── config.ts     # 환경 설정
├── package.json
├── tsconfig.json
└── .env.example
```

## 명령어 상세 📝

### /ping
봇의 응답 시간을 확인합니다.
- **응답**: "퐁! 🏓 지연시간: Xms"

### /소환사 [라이엇ID]
소환사 정보를 조회합니다.
- **형식**: `GameName#TagLine` (예: Hide on bush#KR1)
- **표시 정보**:
  - 소환사 레벨
  - 프로필 아이콘
  - 서버 정보
  - 계정 생성일

## 개발 로드맵 🗺

- [ ] ARAM 전용 통계 (승률, KDA, 최다 플레이 챔피언)
- [ ] 최근 ARAM 매치 기록
- [ ] 챔피언별 ARAM 성능 분석
- [ ] API 응답 캐싱
- [ ] Riot API 레이트 리밋 처리
- [ ] 다국어 지원 확대

## 기여하기 🤝

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스 📄

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 문의 💬

프로젝트에 대한 문의사항이나 버그 리포트는 [Issues](https://github.com/yourusername/lol-aram-discord-bot/issues)에 남겨주세요.

---

**Note**: 이 봇은 Riot Games의 공식 제품이 아니며, Riot Games에서 보증하거나 후원하지 않습니다.