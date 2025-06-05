'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GamepadIcon, 
  Trophy, 
  Dice6, 
  Save, 
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Target,
  Settings,
  Sparkles,
  Gamepad2,
  RefreshCw,
  Award,
  Gift
} from 'lucide-react';
import { useLottoStore } from '@/store/lottoStore';
import LottoNumberBall from './LottoNumberBall';

interface GameModeProps {
  userInfo: {
    birthDate: string;
    gender: string;
  };
}

export default function GameMode({ userInfo }: GameModeProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAnimatingSet, setCurrentAnimatingSet] = useState(0);

  const { 
    isTestMode,
    testWinningNumbers,
    testBonusNumber,
    gameWinningNumbers,
    gameBonusNumber,
    gameTestNumbers,
    showGameWinningForm,
    setTestMode,
    setTestWinningNumbers,
    setTestBonusNumber,
    setGameWinningNumbers,
    setGameBonusNumber,
    setGameTestNumbers,
    setShowGameWinningForm,
    resetGameMode,
    addToHistory
  } = useLottoStore();

  // 컴포넌트 마운트 시 테스트 모드 활성화
  useEffect(() => {
    setTestMode(true);
    return () => setTestMode(false);
  }, [setTestMode]);

  // 당첨번호 입력 처리
  const handleWinningNumberChange = (index: number, value: string) => {
    const num = parseInt(value) || 0;
    if (num < 1 || num > 45) return;
    
    const newNumbers = [...gameWinningNumbers];
    newNumbers[index] = num;
    setGameWinningNumbers(newNumbers);
  };

  // 보너스번호 입력 처리
  const handleBonusNumberChange = (value: string) => {
    const num = parseInt(value) || 0;
    if (num < 1 || num > 45) return;
    setGameBonusNumber(num);
  };

  // 당첨번호 유효성 검사
  const isValidWinningNumbers = () => {
    const allNumbers = [...gameWinningNumbers, gameBonusNumber];
    const validNumbers = allNumbers.filter(num => num >= 1 && num <= 45);
    const uniqueNumbers = new Set(validNumbers);
    
    return validNumbers.length === 7 && uniqueNumbers.size === 7;
  };

  // 당첨번호 저장
  const saveWinningNumbers = () => {
    if (!isValidWinningNumbers()) {
      alert('모든 번호를 1~45 범위에서 중복 없이 입력해주세요.');
      return;
    }
    
    setTestWinningNumbers(gameWinningNumbers);
    setTestBonusNumber(gameBonusNumber);
    setShowGameWinningForm(false);
  };

  // 다시 설정
  const resetWinningNumbers = () => {
    setShowGameWinningForm(true);
    setGameTestNumbers([]);
  };

  // 전체 초기화
  const handleResetAll = () => {
    if (confirm('모든 게임 데이터를 초기화하시겠습니까?')) {
      resetGameMode();
    }
  };

  // 테스트 번호 생성 (Android 앱과 동일한 로직)
  const generateTestNumbers = async () => {
    if (!userInfo.birthDate || !userInfo.gender) {
      alert('번호생성 탭에서 생년월일과 성별을 먼저 입력해주세요.');
      return;
    }

    if (!isValidWinningNumbers()) {
      alert('먼저 당첨번호를 설정해주세요.');
      return;
    }

    setIsGenerating(true);
    setCurrentAnimatingSet(0);
    
    // 기존 번호들을 먼저 초기화
    setGameTestNumbers([]);

    // 게임모드 번호 생성 시작 사운드 (좀 더 신비로운 톤)
    await playAudio('sparkle', 1200, 0.4);

    try {
      // 시드 생성
      const seed = parseInt(userInfo.birthDate) + Date.now();
      let currentSeed = seed;
      
      const random = () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
      };

      const generateSingleSet = (): number[] => {
        let numbers: number[] = [];
        let attempts = 0;
        const maxAttempts = 1000;

        while (numbers.length < 6 && attempts < maxAttempts) {
          const num = Math.floor(random() * 45) + 1;
          
          if (!numbers.includes(num)) {
            numbers.push(num);
          }
          attempts++;
        }
        
        return numbers.sort((a, b) => a - b);
      };

      // 5세트 생성
      const generatedNumbers = Array.from({ length: 5 }, () => generateSingleSet());
      
      // 임시 결과 배열
      const tempResults: number[][] = [];
      
      // 애니메이션 효과 - 각 세트마다 순차적으로 표시
      for (let i = 0; i < 5; i++) {
        setCurrentAnimatingSet(i);
        
        // 각 세트 생성 시 게임모드용 마법 사운드 (높은 톤)
        await playAudio('setGeneration', i);
        
        // 현재 세트를 임시 배열에 추가
        tempResults.push(generatedNumbers[i]);
        
        // 현재까지의 결과를 업데이트
        setGameTestNumbers([...tempResults]);
        
        // 마지막 세트가 아니면 대기
        if (i < 4) {
          await new Promise(resolve => setTimeout(resolve, 1200));
        }
      }

      // 게임모드 완료 사운드 (승리감 있는 특별한 사운드)
      await playAudio('complete');
      // 추가로 특별한 마법 차임
      setTimeout(() => {
        playAudio('chime', 783.99, 1.5); // G note로 마무리
      }, 500);

      // 당첨 결과 확인 및 사운드 재생
      setTimeout(() => {
        const winResults = generatedNumbers.map(numbers => checkWinningResult(numbers));
        const bestResult = winResults.find(result => result.includes('등')) || '탈락';
        
        // 결과에 따른 사운드 재생
        playAudio('winByRank', bestResult);
      }, 2000);

      // 히스토리에 추가
      const now = new Date().toISOString();
      addToHistory({
        id: Date.now().toString(),
        birthDate: userInfo.birthDate,
        gender: userInfo.gender,
        numbers: generatedNumbers,
        dateTime: now,
        winningChance: 0, // 게임모드에서는 확률 계산 안함
        isTestMode: true,
        drawNo: 9999, // 게임모드 식별용
        drawDate: now.split('T')[0],
        winResult: checkAllResults(generatedNumbers),
        // 게임모드 당첨번호 정보 추가
        gameWinningNumbers: gameWinningNumbers,
        gameBonusNumber: gameBonusNumber
      });

    } catch (error) {
      console.error('테스트 번호 생성 실패:', error);
      alert('번호 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
      setCurrentAnimatingSet(-1);
    }
  };

  // 당첨 결과 확인
  const checkWinningResult = (numbers: number[]): string => {
    const matches = numbers.filter(num => gameWinningNumbers.includes(num)).length;
    const hasBonus = numbers.includes(gameBonusNumber);

    if (matches === 6) return '1등';
    if (matches === 5 && hasBonus) return '2등';
    if (matches === 5) return '3등';
    if (matches === 4) return '4등';
    if (matches === 3) return '5등';
    return '탈락';
  };

  // 전체 결과 확인 (히스토리용)
  const checkAllResults = (allNumbers: number[][]): string => {
    const results = allNumbers.map(numbers => checkWinningResult(numbers));
    const winner = results.find(result => result.includes('등'));
    return winner || '탈락';
  };

  // 당첨 번호와 일치하는지 확인
  const isWinningNumber = (number: number): boolean => {
    return gameWinningNumbers.includes(number);
  };

  const isBonusNumber = (number: number): boolean => {
    return number === gameBonusNumber;
  };

  // 오디오 동적 로드
  const playAudio = async (type: string, ...args: (number | string)[]) => {
    if (typeof window === 'undefined') return;
    
    try {
      const { audioEffects } = await import('@/utils/audioEffects');
      switch (type) {
        case 'sparkle':
          await audioEffects.playMagicSparkle(args[0] as number, args[1] as number);
          break;
        case 'setGeneration':
          await audioEffects.playSetGeneration(args[0] as number);
          break;
        case 'complete':
          await audioEffects.playGenerationComplete();
          break;
        case 'chime':
          await audioEffects.playMagicChime(args[0] as number, args[1] as number);
          break;
        case 'winByRank':
          await audioEffects.playWinByRank(args[0] as string);
          break;
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {/* 당첨번호 설정 - 조건부 표시 */}
      {showGameWinningForm ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-yellow-100"
        >
          {/* 일반 번호 입력 */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              당첨번호 (1~45, 6개)
            </label>
            <div className="grid grid-cols-6 gap-2">
              {gameWinningNumbers.map((number, index) => (
                <input
                  key={index}
                  type="number"
                  min="1"
                  max="45"
                  value={number || ''}
                  onChange={(e) => handleWinningNumberChange(index, e.target.value)}
                  className="w-full px-2 py-2 border border-yellow-200 rounded-lg text-center focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm text-gray-800 font-medium"
                  placeholder={`${index + 1}`}
                />
              ))}
            </div>
            {/* 입력된 당첨번호 미리보기 */}
            {gameWinningNumbers.some(num => num > 0) && (
              <div className="flex items-center justify-center space-x-1 mt-2">
                {gameWinningNumbers.map((number, index) => (
                  number > 0 ? (
                    <LottoNumberBall 
                      key={index}
                      number={number} 
                      size="sm" 
                      isWinning={true}
                    />
                  ) : (
                    <div key={index} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500 font-medium">{index + 1}</span>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* 보너스 번호 입력 */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              보너스번호 (1~45, 1개)
            </label>
            <div className="flex items-center space-x-2">
              <div className="w-20">
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={gameBonusNumber || ''}
                  onChange={(e) => handleBonusNumberChange(e.target.value)}
                  className="w-full px-2 py-2 border border-yellow-200 rounded-lg text-center focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm text-gray-800 font-medium"
                  placeholder="보너스"
                />
              </div>
              {/* 입력된 보너스번호 미리보기 */}
              {gameBonusNumber > 0 && (
                <LottoNumberBall 
                  number={gameBonusNumber} 
                  size="sm" 
                  isBonus={true}
                />
              )}
            </div>
          </div>

          {/* 유효성 검사 메시지 */}
          <div className="mb-3">
            {isValidWinningNumbers() ? (
              <div className="flex items-center text-green-600 text-xs font-medium">
                <CheckCircle className="w-3 h-3 mr-1" />
                당첨번호가 올바르게 설정되었습니다.
              </div>
            ) : (
              <div className="flex items-center text-orange-600 text-xs font-medium">
                <AlertCircle className="w-3 h-3 mr-1" />
                모든 번호를 1~45 범위에서 중복 없이 입력해주세요.
              </div>
            )}
          </div>

          {/* 저장 버튼 */}
          <button
            onClick={saveWinningNumbers}
            disabled={!isValidWinningNumbers()}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium text-sm transition-all ${
              isValidWinningNumbers()
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-md'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center">
              <Save className="w-4 h-4 mr-2" />
              당첨번호 설정 완료
            </div>
          </button>
        </motion.div>
      ) : (
        /* 설정된 당첨번호 표시 */
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-green-100"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-800">설정된 당첨번호</span>
            <button
              onClick={resetWinningNumbers}
              className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              재설정
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-3 mb-2">
            {gameWinningNumbers.map((number, index) => (
              <LottoNumberBall 
                key={index}
                number={number} 
                size="sm" 
                isWinning={true}
              />
            ))}
            <div className="w-1 h-8 bg-gray-300 mx-2"></div>
            <LottoNumberBall 
              number={gameBonusNumber} 
              size="sm" 
              isBonus={true}
            />
          </div>

          {/* 생성 버튼 */}
          <button
            onClick={generateTestNumbers}
            disabled={isGenerating || !userInfo.birthDate || !userInfo.gender}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium text-sm transition-all ${
              !isGenerating && userInfo.birthDate && userInfo.gender
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-md'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                번호 생성중... ({currentAnimatingSet + 1}/5)
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Dice6 className="w-4 h-4 mr-2" />
                테스트 번호 생성하기
              </div>
            )}
          </button>
        </motion.div>
      )}

      {/* 5세트 번호 결과 - 항상 표시 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-pink-100"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-800">번호 생성 결과</span>
          {(gameWinningNumbers.some(n => n > 0) || gameBonusNumber > 0 || gameTestNumbers.length > 0) && (
            <button
              onClick={handleResetAll}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              전체 초기화
            </button>
          )}
        </div>

        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, setIndex) => {
            const hasNumbers = gameTestNumbers[setIndex];
            const numbers = hasNumbers || [0, 0, 0, 0, 0, 0];
            const result = hasNumbers ? checkWinningResult(numbers) : '';
            const isWinner = result.includes('등');
            
            return (
              <motion.div
                key={setIndex}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: isGenerating && setIndex > currentAnimatingSet ? 0.3 : 1
                }}
                transition={{ delay: setIndex * 0.1 }}
                className={`p-2 rounded-lg border-2 ${
                  hasNumbers && isWinner 
                    ? 'border-red-300 bg-red-50' 
                    : hasNumbers
                    ? 'border-gray-300 bg-gray-50'
                    : setIndex === 0 ? 'border-pink-300 bg-pink-50' :
                      setIndex === 1 ? 'border-purple-300 bg-purple-50' :
                      setIndex === 2 ? 'border-pink-300 bg-pink-50' :
                      setIndex === 3 ? 'border-purple-300 bg-purple-50' :
                      'border-pink-300 bg-pink-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-800">
                    {setIndex + 1}세트
                  </span>
                  {isGenerating && setIndex === currentAnimatingSet && (
                    <span className="text-xs text-pink-600 font-semibold">
                      생성중...
                    </span>
                  )}
                  {hasNumbers && result && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      isWinner 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {result}
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  {numbers.map((number, numIndex) => (
                    hasNumbers && number > 0 ? (
                      <LottoNumberBall 
                        key={numIndex}
                        number={number} 
                        size="sm"
                        isAnimating={isGenerating && setIndex === currentAnimatingSet}
                        isWinning={isWinningNumber(number)}
                        isBonus={isBonusNumber(number)}
                      />
                    ) : (
                      <div
                        key={numIndex}
                        className="w-8 h-8 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center"
                      >
                        <span className="text-xs text-gray-400">?</span>
                      </div>
                    )
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// 번호 색상 헬퍼 함수
function getNumberColor(number: number): string {
  if (number >= 1 && number <= 10) return 'bg-yellow-500';
  if (number >= 11 && number <= 20) return 'bg-blue-500';
  if (number >= 21 && number <= 30) return 'bg-red-500';
  if (number >= 31 && number <= 40) return 'bg-gray-500';
  if (number >= 41 && number <= 45) return 'bg-green-500';
  return 'bg-gray-400';
} 