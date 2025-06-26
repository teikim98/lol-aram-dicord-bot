import type { DataDragonChampionData } from '../types/riot';

// Data Dragon 기본 URL
const DD_BASE_URL = 'https://ddragon.leagueoflegends.com';

// 현재 LoL 버전 가져오기
async function getCurrentVersion(): Promise<string> {
  const response = await fetch(`${DD_BASE_URL}/api/versions.json`);
  const versions = await response.json() as string[];
  return versions[0]; // 최신 버전
}

// 한글 챔피언 데이터 가져오기
let cachedChampionData: DataDragonChampionData | null = null;

export async function getChampionData(): Promise<DataDragonChampionData> {
  // 캐시된 데이터가 있으면 반환
  if (cachedChampionData) {
    return cachedChampionData;
  }
  
  try {
    const version = await getCurrentVersion();
    const response = await fetch(
      `${DD_BASE_URL}/cdn/${version}/data/ko_KR/champion.json`
    );
    
    cachedChampionData = await response.json() as DataDragonChampionData;
    return cachedChampionData;
  } catch (error) {
    console.error('Failed to fetch champion data:', error);
    throw error;
  }
}

// 영문 이름 → 한글 이름 변환
export async function getChampionNameKR(championNameEN: string): Promise<string> {
  try {
    const championData = await getChampionData();
    const champion = championData.data[championNameEN];
    return champion?.name || championNameEN; // 못 찾으면 영문 반환
  } catch (error) {
    console.error('Failed to get Korean champion name:', error);
    return championNameEN; // 에러시 영문 반환
  }
}