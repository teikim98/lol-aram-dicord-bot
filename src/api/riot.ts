import { regionToCluster, type Region, type Summoner, type RiotAPIError, type RiotAccount, type RegionCluster } from '../types/riot';


// 환경변수에서 API 키 가져오기
const API_KEY = process.env.RIOT_API_KEY!;
const DEFAULT_REGION: Region = 'kr';

function getBaseUrl(region: Region = DEFAULT_REGION): string {
  return `https://${region}.api.riotgames.com`;
}


// 공통 API 요청 함수
async function apiRequest<T>(url: string): Promise<T> {
  try {
    // URL 객체로 생성해서 유효성 확인
    const validUrl = new URL(url);
    
    const response = await fetch(validUrl.toString(), {
      headers: {
        'X-Riot-Token': API_KEY
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', response.status, errorText);
      throw new Error(`Riot API Error: ${response.status}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error('API Request failed:', error);
    console.error('Failed URL:', url);
    throw error;
  }
}

export async function getSummonerByName(summonerName: string, region: Region = DEFAULT_REGION): Promise<Summoner> {
    const encodedName = encodeURIComponent(summonerName);
  const url = `${getBaseUrl(region)}/lol/summoner/v4/summoners/by-name/${encodedName}`;

  return apiRequest<Summoner>(url);
}

export async function getAccountByRiotId(
  gameName: string,
  tagLine: string,
  region: Region = DEFAULT_REGION
): Promise<RiotAccount> {
  const cluster = regionToCluster[region];
  
  // 디버깅 로그 추가
  console.log('Region:', region);
  console.log('Cluster:', cluster);
  console.log('regionToCluster:', regionToCluster);
  
  const encodedGameName = encodeURIComponent(gameName);
  const encodedTagLine = encodeURIComponent(tagLine);
  
  const url = `https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`;
  
  // URL 확인
  console.log('URL:', url);
  
  return apiRequest<RiotAccount>(url);
}

// PUUID로 소환사 정보 조회
export async function getSummonerByPuuid(
  puuid: string,
  region: Region = DEFAULT_REGION
): Promise<Summoner> {
  const baseUrl = getBaseUrl(region);
  const url = `${baseUrl}/lol/summoner/v4/summoners/by-puuid/${puuid}`;
  
  console.log('getSummonerByPuuid URL:', url);
  
  return apiRequest<Summoner>(url);
}

// 편의 함수: Riot ID로 소환사 정보 한번에 조회
export async function getSummonerByRiotId(
  gameName: string,
  tagLine: string,
  region: Region = DEFAULT_REGION
): Promise<Summoner> {
  // 1. Riot ID로 계정 정보 조회
  const account = await getAccountByRiotId(gameName, tagLine, region);
  
  // 2. PUUID로 소환사 정보 조회
  return getSummonerByPuuid(account.puuid, region);
}

