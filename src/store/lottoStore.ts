import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LottoHistory {
  id: string;
  birthDate: string;
  gender: string;
  numbers: number[][];
  dateTime: string;
  winningChance: number;
  isTestMode: boolean;
  drawNo: number;
  drawDate: string;
  winResult?: string;
  generatedKoreanTime?: string; // 한국 시간대 생성 시간
  // 게임모드 전용 필드
  gameWinningNumbers?: number[];
  gameBonusNumber?: number;
}

export interface WinningNumber {
  drawNo: number;
  drawDate: string;
  numbers: number[];
  bonusNumber: number;
  totalSellingAmount: number;
  firstPrizeAmount: number;
  firstWinnerCount: number;
  firstWinAmount: number;
}

interface LottoStore {
  // 생성된 번호 상태
  lottoNumbers: number[][];
  winningChance: number;
  generatedDateTime: string;
  
  // 당첨번호 상태
  winningNumbers: WinningNumber[];
  latestWinningNumber: WinningNumber | null;
  isLoadingWinningNumbers: boolean;
  
  // 히스토리 상태
  history: LottoHistory[];
  
  // 게임모드 상태
  isTestMode: boolean;
  testWinningNumbers: number[];
  testBonusNumber: number;
  
  // 게임모드 UI 상태 (탭 전환 시에도 유지)
  gameWinningNumbers: number[];
  gameBonusNumber: number;
  gameTestNumbers: number[][];
  showGameWinningForm: boolean;
  
  // 액션들
  setLottoNumbers: (numbers: number[][]) => void;
  setWinningChance: (chance: number) => void;
  setGeneratedDateTime: (dateTime: string) => void;
  
  setWinningNumbers: (numbers: WinningNumber[]) => void;
  setLatestWinningNumber: (number: WinningNumber | null) => void;
  setIsLoadingWinningNumbers: (loading: boolean) => void;
  
  addToHistory: (entry: LottoHistory) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  getHistoryForUser: (birthDate: string, gender: string) => LottoHistory[];
  
  setTestMode: (isTest: boolean) => void;
  setTestWinningNumbers: (numbers: number[]) => void;
  setTestBonusNumber: (bonus: number) => void;
  
  // 게임모드 UI 액션들
  setGameWinningNumbers: (numbers: number[]) => void;
  setGameBonusNumber: (bonus: number) => void;
  setGameTestNumbers: (numbers: number[][]) => void;
  setShowGameWinningForm: (show: boolean) => void;
  resetGameMode: () => void;
  
  reset: () => void;
}

const initialState = {
  lottoNumbers: [],
  winningChance: 0,
  generatedDateTime: '',
  winningNumbers: [],
  latestWinningNumber: null,
  isLoadingWinningNumbers: false,
  history: [],
  isTestMode: false,
  testWinningNumbers: [0, 0, 0, 0, 0, 0],
  testBonusNumber: 0,
  gameWinningNumbers: [0, 0, 0, 0, 0, 0],
  gameBonusNumber: 0,
  gameTestNumbers: [],
  showGameWinningForm: true,
};

export const useLottoStore = create<LottoStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setLottoNumbers: (numbers) => set({ lottoNumbers: numbers }),
      setWinningChance: (chance) => set({ winningChance: chance }),
      setGeneratedDateTime: (dateTime) => set({ generatedDateTime: dateTime }),
      
      setWinningNumbers: (numbers) => set({ winningNumbers: numbers }),
      setLatestWinningNumber: (number) => set({ latestWinningNumber: number }),
      setIsLoadingWinningNumbers: (loading) => set({ isLoadingWinningNumbers: loading }),
      
      addToHistory: (entry) => set((state) => ({
        history: [entry, ...state.history].slice(0, 100) // 최대 100개까지만 저장
      })),
      
      removeFromHistory: (id) => set((state) => ({
        history: state.history.filter(item => item.id !== id)
      })),
      
      clearHistory: () => set({ history: [] }),
      
      getHistoryForUser: (birthDate, gender) => {
        const state = get();
        return state.history.filter(
          item => item.birthDate === birthDate && 
                  item.gender === gender &&
                  item.isTestMode === state.isTestMode
        );
      },
      
      setTestMode: (isTest) => set({ isTestMode: isTest }),
      setTestWinningNumbers: (numbers) => set({ testWinningNumbers: numbers }),
      setTestBonusNumber: (bonus) => set({ testBonusNumber: bonus }),
      
      setGameWinningNumbers: (numbers) => set({ gameWinningNumbers: numbers }),
      setGameBonusNumber: (bonus) => set({ gameBonusNumber: bonus }),
      setGameTestNumbers: (numbers) => set({ gameTestNumbers: numbers }),
      setShowGameWinningForm: (show) => set({ showGameWinningForm: show }),
      resetGameMode: () => set({ gameWinningNumbers: [], gameBonusNumber: 0, gameTestNumbers: [], showGameWinningForm: false }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'lotto-store',
      partialize: (state) => ({
        history: state.history,
        winningNumbers: state.winningNumbers,
        latestWinningNumber: state.latestWinningNumber,
        gameWinningNumbers: state.gameWinningNumbers,
        gameBonusNumber: state.gameBonusNumber,
        gameTestNumbers: state.gameTestNumbers,
        showGameWinningForm: state.showGameWinningForm,
      }),
    }
  )
); 