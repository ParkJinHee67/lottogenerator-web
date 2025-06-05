'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  RefreshCw, 
  Calendar, 
  DollarSign, 
  Users, 
  MapPin,
  Search,
  Store,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useLottoStore } from '@/store/lottoStore';
import LottoNumberBall from './LottoNumberBall';
import { 
  fetchLottoWinningNumbers, 
  fetchWinningStores, 
  fetchRecentWinningNumbers,
  LottoWinningResult,
  LottoWinningStore 
} from '@/utils/lottoApi';

export default function WinningNumbers() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [selectedRound, setSelectedRound] = useState<number>(0);
  const [searchRound, setSearchRound] = useState<string>('');
  const [recentWinnings, setRecentWinnings] = useState<LottoWinningResult[]>([]);
  const [winningStores, setWinningStores] = useState<LottoWinningStore[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'stores' | 'statistics'>('current');
  
  const { 
    latestWinningNumber,
    setLatestWinningNumber,
    setIsLoadingWinningNumbers 
  } = useLottoStore();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedRound > 0) {
      loadWinningStores(selectedRound);
    }
  }, [selectedRound]);

  // 초기 데이터 로드
  const loadInitialData = async () => {
    setIsLoading(true);
    setIsLoadingWinningNumbers(true);

    try {
      // 최신 당첨번호 조회
      const latest = await fetchLottoWinningNumbers();
      if (latest) {
        setLatestWinningNumber({
          drawNo: latest.drawNo,
          drawDate: latest.drawDate,
          numbers: latest.numbers,
          bonusNumber: latest.bonusNumber,
          totalSellingAmount: latest.totalSalesAmount,
          firstPrizeAmount: latest.firstPrizeAmount,
          firstWinnerCount: latest.firstWinnerCount,
          firstWinAmount: Math.floor(latest.firstPrizeAmount / latest.firstWinnerCount)
        });
        setSelectedRound(latest.drawNo);
      }

      // 최근 10회차 데이터 로드
      const recent = await fetchRecentWinningNumbers(10);
      setRecentWinnings(recent);

    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingWinningNumbers(false);
    }
  };

  // 특정 회차 당첨번호 조회
  const searchSpecificRound = async () => {
    if (!searchRound || isNaN(Number(searchRound))) {
      alert('올바른 회차 번호를 입력해주세요.');
      return;
    }

    const round = Number(searchRound);
    if (round < 1 || round > 1200) {
      alert('회차 번호는 1부터 1200 사이여야 합니다.');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await fetchLottoWinningNumbers(round);
      if (result) {
        // recentWinnings에 추가 (중복 제거)
        setRecentWinnings(prev => {
          const filtered = prev.filter(item => item.drawNo !== result.drawNo);
          return [result, ...filtered].slice(0, 10);
        });
        setSelectedRound(result.drawNo);
      } else {
        alert('해당 회차의 당첨번호를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('회차 검색 실패:', error);
      alert('당첨번호 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1등 배출점 정보 로드
  const loadWinningStores = async (drawNo: number) => {
    setIsLoadingStores(true);
    
    try {
      const stores = await fetchWinningStores(drawNo);
      setWinningStores(stores);
    } catch (error) {
      console.error('판매점 정보 로드 실패:', error);
      setWinningStores([]);
    } finally {
      setIsLoadingStores(false);
    }
  };

  const formatAmount = (amount: number): string => {
    if (amount >= 1000000000000) {
      // 1조 이상
      const trillions = Math.floor(amount / 1000000000000);
      const billions = Math.floor((amount % 1000000000000) / 100000000);
      if (billions > 0) {
        return `${trillions}조 ${billions}억원`;
      }
      return `${trillions}조원`;
    } else if (amount >= 100000000) {
      // 1억 이상
      const billions = Math.floor(amount / 100000000);
      const tenMillions = Math.floor((amount % 100000000) / 10000000);
      const millions = Math.floor((amount % 10000000) / 10000);
      
      let result = `${billions}억`;
      if (tenMillions > 0 || millions > 0) {
        const remainingAmount = tenMillions * 1000 + millions;
        if (remainingAmount > 0) {
          result += ` ${remainingAmount}만`;
        }
      }
      return result + '원';
    } else if (amount >= 10000) {
      // 1만 이상
      const tenThousands = Math.floor(amount / 10000);
      const thousands = Math.floor((amount % 10000) / 1000);
      if (thousands > 0) {
        return `${tenThousands}만 ${thousands}천원`;
      }
      return `${tenThousands}만원`;
    } else if (amount >= 1000) {
      // 1천 이상
      const thousands = Math.floor(amount / 1000);
      return `${thousands}천원`;
    } else {
      return `${amount}원`;
    }
  };

  const selectedWinningNumber = recentWinnings.find(w => w.drawNo === selectedRound);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* 헤더 및 검색 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            당첨번호 조회
          </h2>
          <button
            onClick={loadInitialData}
            disabled={isLoading}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 flex items-center text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        {/* 회차 검색 */}
        <div className="flex space-x-2 mb-3">
          <input
            type="number"
            value={searchRound}
            onChange={(e) => setSearchRound(e.target.value)}
            placeholder="회차 번호 입력 (예: 1174)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            min="1"
            max="1200"
          />
          <button
            onClick={searchSpecificRound}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 flex items-center text-sm font-medium"
          >
            <Search className="w-4 h-4 mr-1" />
            검색
          </button>
        </div>

        {/* 회차 선택 */}
        {recentWinnings.length > 0 && (
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              최근 회차 선택
            </label>
            <select
              value={selectedRound}
              onChange={(e) => setSelectedRound(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm font-medium"
            >
              {recentWinnings.map((winning) => (
                <option key={winning.drawNo} value={winning.drawNo}>
                  제{winning.drawNo}회 ({winning.drawDate})
                </option>
              ))}
            </select>
          </div>
        )}
      </motion.div>

      {/* 탭 메뉴 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-1 border border-gray-100"
      >
        <div className="flex space-x-1">
          {[
            { key: 'current', label: '당첨번호', icon: Trophy },
            { key: 'stores', label: '1등 배출점', icon: Store },
            { key: 'statistics', label: '통계', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-1" />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 탭 컨텐츠 */}
      <AnimatePresence mode="wait">
        {activeTab === 'current' && selectedWinningNumber && (
          <motion.div 
            key="current"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100"
          >
            {/* 회차 정보 */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                제{selectedWinningNumber.drawNo}회 당첨번호
              </h3>
              <div className="flex items-center justify-center text-gray-700 text-sm font-medium">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{selectedWinningNumber.drawDate}</span>
              </div>
            </div>

            {/* 당첨번호 공들 */}
            <div className="flex justify-center items-center space-x-2 mb-4">
              {selectedWinningNumber.numbers.map((number, index) => (
                <LottoNumberBall 
                  key={index} 
                  number={number} 
                  size="md" 
                  isWinning={true}
                />
              ))}
              <div className="text-lg text-gray-500 mx-1 font-bold">+</div>
              <LottoNumberBall 
                number={selectedWinningNumber.bonusNumber} 
                size="md" 
                isBonus={true}
              />
            </div>

            {/* 당첨 정보 */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
                <DollarSign className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
                <p className="text-gray-800 font-bold mb-1">1등 당첨금</p>
                <p className="text-sm font-bold text-yellow-700">
                  {formatAmount(selectedWinningNumber.firstPrizeAmount)}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <p className="text-gray-800 font-bold mb-1">1등 당첨자</p>
                <p className="text-sm font-bold text-blue-700">{selectedWinningNumber.firstWinnerCount}명</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                <TrendingUp className="w-4 h-4 text-green-600 mx-auto mb-1" />
                <p className="text-gray-800 font-bold mb-1">총 판매액</p>
                <p className="text-sm font-bold text-green-700">
                  {formatAmount(selectedWinningNumber.totalSalesAmount)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'stores' && (
          <motion.div 
            key="stores"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Store className="w-5 h-5 mr-2 text-blue-500" />
                1등 배출점 정보
              </h3>
              {selectedRound && (
                <span className="text-sm text-gray-600 font-medium">
                  제{selectedRound}회
                </span>
              )}
            </div>

            {isLoadingStores ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">판매점 정보를 불러오는 중...</p>
              </div>
            ) : winningStores.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {winningStores.map((store, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{store.name}</h4>
                        <div className="flex items-center text-gray-600 text-xs mb-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{store.address}</span>
                        </div>
                        {store.region && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {store.region}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          store.combination === '자동' 
                            ? 'bg-green-100 text-green-800'
                            : store.combination === '수동'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {store.combination}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Store className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">
                  {selectedRound ? '해당 회차의 판매점 정보가 없습니다.' : '회차를 선택해주세요.'}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'statistics' && (
          <motion.div 
            key="statistics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 flex items-center mb-3">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              최근 당첨번호 분석
            </h3>

            {recentWinnings.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentWinnings.map((winning) => (
                  <div key={winning.drawNo} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900 text-sm">제{winning.drawNo}회</span>
                      <span className="text-gray-600 text-xs flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {winning.drawDate}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {winning.numbers.map((number, index) => (
                        <LottoNumberBall 
                          key={index} 
                          number={number} 
                          size="sm" 
                        />
                      ))}
                      <span className="text-xs text-gray-500 mx-1">+</span>
                      <LottoNumberBall 
                        number={winning.bonusNumber} 
                        size="sm" 
                        isBonus={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">통계 데이터를 불러오는 중...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 로딩 상태 */}
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">데이터를 불러오는 중...</p>
        </motion.div>
      )}
    </div>
  );
} 