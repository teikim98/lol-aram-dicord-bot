// Riot API에서 사용하는 기본 타입들

// 서버/지역 타입
export type Region = 'kr' | 'na1' | 'euw1' | 'eun1' | 'jp1' | 'br1' | 'la1' | 'la2' | 'oc1' | 'tr1' | 'ru';

// 소환사 정보
export interface Summoner {
  id: string;              // 암호화된 소환사 ID
  accountId: string;       // 암호화된 계정 ID
  puuid: string;           // 암호화된 PUUID
  name: string;            // 소환사명
  profileIconId: number;   // 프로필 아이콘 ID
  revisionDate: number;    // 마지막 수정 시간
  summonerLevel: number;   // 소환사 레벨
}

// API 에러 응답
export interface RiotAPIError {
  status: {
    message: string;
    status_code: number;
  };
}

// Riot Account (게임네임#태그라인)
export interface RiotAccount {
  puuid: string;
  gameName: string;    // 게임네임 (예: Hide on bush)
  tagLine: string;     // 태그라인 (예: KR1)
}

// 지역 클러스터 (Account API용)
export type RegionCluster = 'americas' | 'asia' | 'europe' | 'esports';

// 지역 -> 클러스터 매핑
export const regionToCluster: Record<Region, RegionCluster> = {
  'kr': 'asia',
  'jp1': 'asia',
  'na1': 'americas',
  'br1': 'americas',
  'la1': 'americas',
  'la2': 'americas',
  'euw1': 'europe',
  'eun1': 'europe',
  'tr1': 'europe',
  'ru': 'europe',
  'oc1': 'americas'
};

// 게임 큐 타입 (ARAM = 450)
export const QUEUE_TYPE = {
  ARAM: 450,
  NORMAL_DRAFT: 400,
  RANKED_SOLO: 420,
  RANKED_FLEX: 440,
} as const;

// 매치 리스트 아이템
export interface MatchReference {
  matchId: string;
  queueId: number;
  gameCreation: number;
  gameDuration: number;
}

// 매치 상세 정보
export interface Match {
  metadata: {
    matchId: string;
    participants: string[];  // PUUID 리스트
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    queueId: number;
    participants: Participant[];
  };
}

// 매치 참가자 정보
export interface Participant {
  puuid: string;
  summonerName: string;
  championName: string;
  championId: number;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  totalDamageDealtToChampions: number;
  goldEarned: number;
}

// ARAM 전적 통계
export interface AramMatchStat {
  matchId: string;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  gameCreation: number;
  gameDuration: number;
}

// ARAM 전적 요약
export interface AramStatsSummary {
  matches: AramMatchStat[];
  summary: {
    wins: number;
    losses: number;
    totalGames: number;
  };
}


