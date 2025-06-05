// 로또 당첨번호 및 판매점 정보 API 유틸리티

export interface LottoWinningResult {
  drawNo: number;
  drawDate: string;
  numbers: number[];
  bonusNumber: number;
  totalSalesAmount: number;
  firstPrizeAmount: number;
  firstWinnerCount: number;
  returnValue: string;
}

export interface LottoWinningStore {
  name: string;
  address: string;
  combination: '자동' | '수동' | '반자동';
  lat?: number;
  lng?: number;
  region?: string;
}

// 동행복권 공식 API에서 당첨번호 조회
export const fetchLottoWinningNumbers = async (drawNo?: number): Promise<LottoWinningResult | null> => {
  try {
    let targetDrawNo = drawNo;
    
    // 회차 번호가 없으면 최신 회차 조회
    if (!targetDrawNo) {
      const latestResponse = await fetch('https://smok95.github.io/lotto/results/latest.json');
      if (latestResponse.ok) {
        const latestData = await latestResponse.json();
        targetDrawNo = latestData.draw_no;
      } else {
        // 폴백: 동행복권 사이트에서 최신 회차 파싱
        const mainPageResponse = await fetch('https://dhlottery.co.kr/common.do?method=main');
        const mainPageText = await mainPageResponse.text();
        const match = mainPageText.match(/<strong id="lottoDrwNo">(\d+)<\/strong>/);
        if (match) {
          targetDrawNo = parseInt(match[1]);
        } else {
          targetDrawNo = 1174; // 기본값
        }
      }
    }

    // 동행복권 공식 API 호출
    const apiUrl = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${targetDrawNo}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('API 요청 실패');
    }
    
    const data = await response.json();
    
    if (data.returnValue !== 'success') {
      return null;
    }

    return {
      drawNo: data.drwNo,
      drawDate: data.drwNoDate,
      numbers: [
        data.drwtNo1,
        data.drwtNo2,
        data.drwtNo3,
        data.drwtNo4,
        data.drwtNo5,
        data.drwtNo6
      ].sort((a, b) => a - b),
      bonusNumber: data.bnusNo,
      totalSalesAmount: data.totSellamnt,
      firstPrizeAmount: data.firstWinamnt,
      firstWinnerCount: data.firstPrzwnerCo,
      returnValue: data.returnValue
    };
  } catch (error) {
    console.error('로또 당첨번호 조회 실패:', error);
    
    // 폴백: GitHub API 사용
    try {
      const fallbackUrl = drawNo 
        ? `https://smok95.github.io/lotto/results/${drawNo}.json`
        : 'https://smok95.github.io/lotto/results/latest.json';
      
      const fallbackResponse = await fetch(fallbackUrl);
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        
        return {
          drawNo: fallbackData.draw_no,
          drawDate: fallbackData.date.split('T')[0],
          numbers: fallbackData.numbers,
          bonusNumber: fallbackData.bonus_no,
          totalSalesAmount: fallbackData.total_sales_amount || 0,
          firstPrizeAmount: fallbackData.divisions?.[0]?.prize || 0,
          firstWinnerCount: fallbackData.divisions?.[0]?.winners || 0,
          returnValue: 'success'
        };
      }
    } catch (fallbackError) {
      console.error('폴백 API도 실패:', fallbackError);
    }
    
    return null;
  }
};

// 1등 배출점 정보 조회
export const fetchWinningStores = async (drawNo: number): Promise<LottoWinningStore[]> => {
  try {
    // GitHub API에서 판매점 정보 조회
    const response = await fetch(`https://smok95.github.io/lotto/winning-stores/${drawNo}.json`);
    
    if (!response.ok) {
      throw new Error('판매점 정보 조회 실패');
    }
    
    const stores = await response.json();
    
    return stores.map((store: any) => ({
      name: store.name,
      address: store.address,
      combination: store.combination,
      lat: store.lat,
      lng: store.lng,
      region: store.address.split(' ')[0] // 첫 번째 공백 전까지를 지역으로 설정
    }));
  } catch (error) {
    console.error('판매점 정보 조회 실패:', error);
    return [];
  }
};

// 최근 N회차 당첨번호 조회
export const fetchRecentWinningNumbers = async (count: number = 10): Promise<LottoWinningResult[]> => {
  try {
    const results: LottoWinningResult[] = [];
    const latest = await fetchLottoWinningNumbers();
    
    if (!latest) return [];
    
    const startDrawNo = latest.drawNo - count + 1;
    
    for (let i = startDrawNo; i <= latest.drawNo; i++) {
      const result = await fetchLottoWinningNumbers(i);
      if (result) {
        results.push(result);
      }
    }
    
    return results.reverse(); // 최신순으로 정렬
  } catch (error) {
    console.error('최근 당첨번호 조회 실패:', error);
    return [];
  }
};

// 당첨번호 통계 정보
export const getLottoStatistics = async (): Promise<{ [key: number]: number }> => {
  try {
    const recentResults = await fetchRecentWinningNumbers(100); // 최근 100회차
    const frequency: { [key: number]: number } = {};
    
    // 1-45까지 초기화
    for (let i = 1; i <= 45; i++) {
      frequency[i] = 0;
    }
    
    // 빈도 계산
    recentResults.forEach(result => {
      result.numbers.forEach(num => {
        frequency[num]++;
      });
      // 보너스 번호도 포함
      frequency[result.bonusNumber]++;
    });
    
    return frequency;
  } catch (error) {
    console.error('로또 통계 조회 실패:', error);
    return {};
  }
}; 