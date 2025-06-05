'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, Calendar, Target, Trophy, Filter, Dice6 } from 'lucide-react';
import { useLottoStore } from '@/store/lottoStore';
import LottoNumberBall from '@/components/LottoNumberBall';

interface LottoHistoryProps {
  userInfo: {
    birthDate: string;
    gender: string;
  };
}

export default function LottoHistory({ userInfo }: LottoHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'normal' | 'test'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const { 
    history, 
    isTestMode,
    removeFromHistory, 
    clearHistory, 
    getHistoryForUser 
  } = useLottoStore();

  // 사용자별 히스토리 필터링
  const getUserHistory = () => {
    if (!userInfo.birthDate || !userInfo.gender) return [];
    
    const userHistory = history.filter(item => 
      item.birthDate === userInfo.birthDate && 
      item.gender === userInfo.gender
    );

    // 모드별 필터링
    switch (filter) {
      case 'normal':
        return userHistory.filter(item => !item.isTestMode);
      case 'test':
        return userHistory.filter(item => item.isTestMode);
      default:
        return userHistory;
    }
  };

  const userHistory = getUserHistory();

  // 당첨 결과 확인 (게임모드용)
  const checkGameModeWinningResult = (numbers: number[], gameWinningNumbers: number[], gameBonusNumber: number): string => {
    const matches = numbers.filter(num => gameWinningNumbers.includes(num)).length;
    const hasBonus = numbers.includes(gameBonusNumber);

    if (matches === 6) return '1등';
    if (matches === 5 && hasBonus) return '2등';
    if (matches === 5) return '3등';
    if (matches === 4) return '4등';
    if (matches === 3) return '5등';
    return '탈락';
  };

  // 당첨 결과 확인
  const checkWinningResult = (historyItem: any, setNumbers: number[]) => {
    if (historyItem.isTestMode && historyItem.gameWinningNumbers && historyItem.gameBonusNumber) {
      // 게임모드인 경우 실시간 계산
      return checkGameModeWinningResult(setNumbers, historyItem.gameWinningNumbers, historyItem.gameBonusNumber);
    }
    
    if (!historyItem.winResult) return '';
    return historyItem.winResult;
  };

  // 번호가 당첨번호인지 확인 (게임모드용)
  const isWinningNumber = (number: number, gameWinningNumbers: number[], gameBonusNumber: number): 'winning' | 'bonus' | 'none' => {
    if (gameWinningNumbers.includes(number)) return 'winning';
    if (number === gameBonusNumber) return 'bonus';
    return 'none';
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 한국 시간대 포맷팅
  const formatKoreanTime = (dateString: string, koreanTime?: string) => {
    if (koreanTime) {
      return koreanTime;
    }
    // 기존 UTC 시간을 한국 시간으로 변환
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Seoul',
      hour12: false
    });
  };

  // 히스토리 삭제
  const handleDelete = (id: string) => {
    removeFromHistory(id);
    setShowDeleteConfirm(null);
  };

  // 전체 삭제
  const handleClearAll = () => {
    if (confirm('정말로 모든 기록을 삭제하시겠습니까?')) {
      clearHistory();
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <History className="w-5 h-5 mr-2 text-blue-500" />
            생성 기록
          </h2>
          {userHistory.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              전체 삭제
            </button>
          )}
        </div>

        {/* 필터 */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">필터:</span>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: '전체' },
              { key: 'normal', label: '일반모드' },
              { key: 'test', label: '게임모드' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as any)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  filter === item.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 통계 */}
        {userHistory.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">총 생성 횟수</p>
              <p className="text-xl font-bold text-blue-600">{userHistory.length}회</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">평균 확률</p>
              <p className="text-xl font-bold text-green-600">
                {(userHistory.reduce((sum, item) => sum + item.winningChance, 0) / userHistory.length).toFixed(1)}%
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">최고 확률</p>
              <p className="text-xl font-bold text-purple-600">
                {Math.max(...userHistory.map(item => item.winningChance)).toFixed(1)}%
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">당첨 횟수</p>
              <p className="text-xl font-bold text-yellow-600">
                {userHistory.filter(item => item.winResult && !item.winResult.includes('탈락')).length}회
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* 사용자 정보 필요 */}
      {(!userInfo.birthDate || !userInfo.gender) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-12 text-center"
        >
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">사용자 정보가 필요합니다</h3>
          <p className="text-gray-600">
            번호생성 탭에서 생년월일과 성별을 입력하면<br />
            개인별 생성 기록을 확인할 수 있습니다.
          </p>
        </motion.div>
      )}

      {/* 기록 목록 */}
      {userInfo.birthDate && userInfo.gender && (
        <div className="space-y-4">
          <AnimatePresence>
            {userHistory.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-lg p-12 text-center"
              >
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">생성 기록이 없습니다</h3>
                <p className="text-gray-600">
                  번호생성 탭에서 로또번호를 생성해보세요.
                </p>
              </motion.div>
            ) : (
              userHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  {/* 기록 헤더 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col space-y-2 flex-1">
                      {/* 첫 번째 줄: 모드 + 회차/생성시간 */}
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.isTestMode 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.isTestMode ? '게임모드' : '일반모드'}
                        </div>
                        {!item.isTestMode && (
                          <div className="flex items-center text-xs text-blue-700 font-bold">
                            <span>제{item.drawNo}회</span>
                          </div>
                        )}
                        <div className="flex items-center text-xs text-gray-800">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatKoreanTime(item.dateTime, item.generatedKoreanTime)}
                        </div>
                      </div>
                      
                      {/* 두 번째 줄: 추첨일 + 당첨확률 */}
                      <div className="flex items-center space-x-4">
                        {!item.isTestMode && (
                          <div className="flex items-center text-xs text-gray-800 font-medium">
                            <span>추첨: {item.drawDate}</span>
                          </div>
                        )}
                        <div className="flex items-center text-xs">
                          <span className="text-gray-800">확률: </span>
                          <span className="text-purple-600 font-medium">{item.winningChance.toFixed(2)}%</span>
                        </div>
                        {item.winResult && (
                          <div className="flex items-center text-xs">
                            <span className="text-gray-800">결과: </span>
                            <span className={`font-medium ${
                              item.winResult.includes('등') 
                                ? 'text-red-600' 
                                : 'text-gray-800'
                            }`}>
                              {item.winResult}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 회차 정보 또는 게임모드 당첨번호 */}
                  {item.isTestMode && item.gameWinningNumbers && item.gameBonusNumber ? (
                    /* 게임모드: 당첨번호 표시 */
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">당시 입력한 당첨번호:</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {item.gameWinningNumbers.map((number, index) => (
                          <LottoNumberBall 
                            key={index}
                            number={number} 
                            size="sm" 
                            isWinning={true}
                          />
                        ))}
                        <div className="w-1 h-6 bg-gray-300 mx-2"></div>
                        <LottoNumberBall 
                          number={item.gameBonusNumber} 
                          size="sm" 
                          isBonus={true}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                        <div>
                          <span className="text-gray-800 font-medium">생성시간:</span>
                          <span className="ml-2 font-bold text-gray-900">{formatKoreanTime(item.dateTime, item.generatedKoreanTime)}</span>
                        </div>
                        {item.winResult && (
                          <div>
                            <span className="text-gray-800 font-medium">최고결과:</span>
                            <span className={`ml-2 font-bold ${
                              item.winResult.includes('등') 
                                ? 'text-red-600' 
                                : 'text-gray-900'
                            }`}>
                              {item.winResult}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* 일반모드: 기존 회차 정보 */
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-800 font-medium">대상 회차:</span>
                          <span className="ml-2 font-bold text-blue-700">제{item.drawNo}회</span>
                        </div>
                        <div>
                          <span className="text-gray-800 font-medium">추첨일:</span>
                          <span className="ml-2 font-bold text-gray-900">{item.drawDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-800 font-medium">생성시간:</span>
                          <span className="ml-2 font-bold text-gray-900">{formatKoreanTime(item.dateTime, item.generatedKoreanTime)}</span>
                        </div>
                        <div>
                          <span className="text-gray-800 font-medium">당첨확률:</span>
                          <span className="ml-2 font-bold text-purple-600">
                            {item.winningChance.toFixed(2)}%
                          </span>
                        </div>
                        {item.winResult && (
                          <div className="col-span-2">
                            <span className="text-gray-800 font-medium">당첨결과:</span>
                            <span className={`ml-2 font-bold ${
                              item.winResult.includes('등') 
                                ? 'text-red-600' 
                                : 'text-gray-900'
                            }`}>
                              {item.winResult}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 생성된 로또 번호들 */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <Dice6 className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">생성된 번호 ({item.numbers.length}세트)</span>
                    </div>
                    
                    {item.numbers.map((numbers, setIndex) => (
                      <div key={setIndex} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 font-medium">세트 {setIndex + 1}</span>
                          {item.isTestMode && item.gameWinningNumbers && item.gameBonusNumber && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                              {checkGameModeWinningResult(numbers, item.gameWinningNumbers, item.gameBonusNumber)}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          {numbers.map((number, numberIndex) => {
                            const isWinning = item.isTestMode && item.gameWinningNumbers && item.gameBonusNumber
                              ? isWinningNumber(number, item.gameWinningNumbers, item.gameBonusNumber)
                              : 'none';
                            
                            return (
                              <LottoNumberBall 
                                key={numberIndex}
                                number={number} 
                                size="sm"
                                isWinning={isWinning === 'winning'}
                                isBonus={isWinning === 'bonus'}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* 삭제 확인 대화상자 */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowDeleteConfirm(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-xl p-6 max-w-sm w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">기록 삭제</h3>
                  <p className="text-gray-600 mb-6">
                    이 기록을 삭제하시겠습니까?<br />
                    삭제된 기록은 복구할 수 없습니다.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(showDeleteConfirm);
                        setShowDeleteConfirm(null);
                      }}
                      className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 전체 삭제 확인 대화상자 */}
          <AnimatePresence>
            {showClearConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowClearConfirm(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-xl p-6 max-w-sm w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">전체 삭제</h3>
                  <p className="text-gray-600 mb-6">
                    모든 기록을 삭제하시겠습니까?<br />
                    삭제된 기록은 복구할 수 없습니다.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => {
                        handleClearAll();
                        setShowClearConfirm(false);
                      }}
                      className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      전체 삭제
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}