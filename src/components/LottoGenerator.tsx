'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dice6, 
  User, 
  Calendar, 
  Sparkles, 
  Download,
  Share2,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Clock,
  Hash
} from 'lucide-react';
import { useLottoStore } from '@/store/lottoStore';
import LottoNumberBall from '@/components/LottoNumberBall';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { fetchLottoWinningNumbers } from '@/utils/lottoApi';

interface LottoGeneratorProps {
  userInfo: {
    birthDate: string;
    gender: string;
  };
  setUserInfo: (info: { birthDate: string; gender: string }) => void;
}

export default function LottoGenerator({ userInfo, setUserInfo }: LottoGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [excludeNumbers, setExcludeNumbers] = useState<Set<number>>(new Set());
  const [includeNumbers, setIncludeNumbers] = useState<Set<number>>(new Set());
  const [preventConsecutive, setPreventConsecutive] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [currentAnimatingSet, setCurrentAnimatingSet] = useState(0);
  const [numberMode, setNumberMode] = useState<'exclude' | 'include'>('exclude');
  const [nextDrawInfo, setNextDrawInfo] = useState<{
    drawNo: number;
    drawDate: string;
  } | null>(null);
  const [winningChance, setWinningChance] = useState(0);
  const [generatedDateTime, setGeneratedDateTime] = useState<string | null>(null);

  const { 
    lottoNumbers, 
    addToHistory,
    setLottoNumbers
  } = useLottoStore();

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
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  };

  // 다음 회차 정보 로드
  const loadNextDrawInfo = async () => {
    try {
      const latest = await fetchLottoWinningNumbers();
      if (latest) {
        const nextDrawNo = latest.drawNo + 1;
        const nextDrawDate = getNextSaturday();
        setNextDrawInfo({
          drawNo: nextDrawNo,
          drawDate: nextDrawDate
        });
      }
    } catch (error) {
      console.error('다음 회차 정보 로드 실패:', error);
      // 폴백: 기본값 설정
      setNextDrawInfo({
        drawNo: 1175, // 기본값
        drawDate: getNextSaturday()
      });
    }
  };

  // 다음 토요일 계산
  const getNextSaturday = (): string => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
    const nextSaturday = new Date(now);
    nextSaturday.setDate(now.getDate() + daysUntilSaturday);
    return nextSaturday.toISOString().split('T')[0];
  };

  // 현재 시간을 한국 시간대로 포맷
  const formatKoreanDateTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Seoul',
      hour12: false
    };
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  };

  // 당첨 확률 계산 (Android 앱과 동일한 로직)
  const calculateChance = (birthDate: string, gender: string): number => {
    try {
      if (!birthDate || birthDate.length !== 8) return 5.0;
      
      const year = parseInt(birthDate.substring(0, 4));
      const month = parseInt(birthDate.substring(4, 6));
      const day = parseInt(birthDate.substring(6, 8));
      
      if (year < 1900 || year > new Date().getFullYear() ||
          month < 1 || month > 12 ||
          day < 1 || day > 31) {
        return 5.0;
      }
      
      const currentYear = new Date().getFullYear();
      const age = currentYear - year + 1;
      
      // 생일 기반 기본 확률 계산
      const monthDayValue = (month * 100 + day);
      const normalizedValue = Math.abs(monthDayValue - 101) / 100.0; // 1월 1일 기준
      
      // 성별에 따른 보정값
      const genderBonus = gender === '남' ? 0.2 : 0.3;
      
      // 나이에 따른 보정값
      const ageBonus = (50 - age) * 0.1;
      
      // 시간에 따른 랜덤 보정값
      const timeBonus = (Math.random() * 6.0) - 3.0;
      
      // 최종 확률 계산
      const finalChance = 5.0 + normalizedValue + genderBonus + (ageBonus / 10.0) + timeBonus;
      
      // 1% ~ 20% 범위로 제한
      return Math.max(1.0, Math.min(20.0, finalChance));
    } catch (error) {
      return 5.0;
    }
  };

  // 로또 번호 생성 (Android 앱과 동일한 로직)
  const createLottoNumbers = (seed: number): number[][] => {
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const generateSingleSet = (): number[] => {
      let numbers: number[] = [];
      let attempts = 0;
      const maxAttempts = 1000;

      while (numbers.length < 6 && attempts < maxAttempts) {
        const num = Math.floor(random() * 45) + 1;
        
        // 중복 체크
        if (numbers.includes(num)) {
          attempts++;
          continue;
        }
        
        // 제외 번호 체크
        if (excludeNumbers.has(num)) {
          attempts++;
          continue;
        }
        
        // 연속 번호 방지 체크
        if (preventConsecutive && numbers.some(n => Math.abs(n - num) === 1)) {
          attempts++;
          continue;
        }
        
        numbers.push(num);
        attempts++;
      }
      
      // 포함해야 할 번호 추가
      for (const includeNum of includeNumbers) {
        if (numbers.length < 6 && !numbers.includes(includeNum)) {
          numbers.pop(); // 마지막 번호 제거
          numbers.push(includeNum);
        }
      }
      
      // 6개가 안 되면 랜덤으로 채우기
      while (numbers.length < 6) {
        const num = Math.floor(random() * 45) + 1;
        if (!numbers.includes(num) && !excludeNumbers.has(num)) {
          numbers.push(num);
        }
      }
      
      return numbers.sort((a, b) => a - b);
    };

    return Array.from({ length: 5 }, () => generateSingleSet());
  };

  // 번호 생성 함수
  const generateNumbers = async () => {
    if (!userInfo.birthDate || !userInfo.gender) {
      alert('생년월일과 성별을 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setCurrentAnimatingSet(0);
    
    // 시작 소리
    await playAudio('sparkle', 1200, 0.4);
    
    // 기존 번호들을 먼저 초기화
    setLottoNumbers([]);

    try {
      // 다음 회차 정보가 없으면 다시 로드
      if (!nextDrawInfo) {
        await loadNextDrawInfo();
      }

      // 당첨 확률 계산
      const chance = calculateChance(userInfo.birthDate, userInfo.gender);
      setWinningChance(chance);

      // 시드 생성 (생년월일 + 현재 시간)
      const seed = parseInt(userInfo.birthDate) + Date.now();
      
      // 번호 생성
      const numbers = createLottoNumbers(seed);
      
      // 임시 결과 배열
      const tempResults: number[][] = [];
      
      // 애니메이션 효과 - 각 세트마다 순차적으로 표시
      for (let i = 0; i < 5; i++) {
        setCurrentAnimatingSet(i);
        
        // 세트 생성 소리
        await playAudio('setGeneration', i);
        
        // 현재 세트를 임시 배열에 추가
        tempResults.push(numbers[i]);
        
        // 현재까지의 결과를 업데이트
        setLottoNumbers([...tempResults]);
        
        // 마지막 세트가 아니면 대기
        if (i < 4) {
          await new Promise(resolve => setTimeout(resolve, 1200));
        }
      }
      
      // 완료 소리
      await playAudio('complete');
      
      // 마무리 소리 (약간의 지연 후)
      setTimeout(() => {
        playAudio('chime', 783.99, 1.5); // G note로 마무리
      }, 600);
      
      const now = new Date();
      const nowISO = now.toISOString();
      const koreanTime = formatKoreanDateTime(now);
      
      setGeneratedDateTime(nowISO);

      // 히스토리에 추가
      addToHistory({
        id: Date.now().toString(),
        birthDate: userInfo.birthDate,
        gender: userInfo.gender,
        numbers: numbers,
        dateTime: nowISO,
        winningChance: chance,
        isTestMode: false,
        drawNo: nextDrawInfo?.drawNo || 1175,
        drawDate: nextDrawInfo?.drawDate || getNextSaturday(),
        generatedKoreanTime: koreanTime // 한국 시간 추가
      });

    } catch (error) {
      console.error('번호 생성 실패:', error);
      alert('번호 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
      setCurrentAnimatingSet(-1);
    }
  };

  const isFormValid = userInfo.birthDate.length === 8 && userInfo.gender;

  // 컴포넌트 마운트 시 다음 회차 정보 로드
  useEffect(() => {
    loadNextDrawInfo();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {/* 사용자 정보 입력 - 컴팩트 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-pink-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              생년월일 (YYYYMMDD)
            </label>
            <input
              type="text"
              value={userInfo.birthDate}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                setUserInfo({ ...userInfo, birthDate: value });
              }}
              placeholder="19901225"
              className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              성별
            </label>
            <div className="flex space-x-1">
              {['남', '여'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => setUserInfo({ ...userInfo, gender })}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                    userInfo.gender === gender
                      ? 'border-pink-400 bg-pink-50 text-pink-700'
                      : 'border-pink-200 text-gray-700 hover:bg-pink-50'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={generateNumbers}
              disabled={!isFormValid || isGenerating}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium text-sm transition-all ${
                isFormValid && !isGenerating
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md'
                  : 'bg-pink-400 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  생성중...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  번호생성
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* 고급 옵션 - 라디오버튼 방식 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-purple-100"
      >
        <button
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-800 mb-2"
        >
          <div className="flex items-center">
            <Settings className="w-4 h-4 mr-2 text-purple-500" />
            고급 옵션
          </div>
          {showAdvancedOptions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* 선택된 번호 요약 (항상 표시) */}
        {(excludeNumbers.size > 0 || includeNumbers.size > 0 || preventConsecutive) && (
          <div className="text-xs mb-2 space-y-2">
            {/* 제외번호와 포함번호를 가로로 배치 */}
            <div className="flex items-center justify-between">
              {/* 제외번호 */}
              <div className="flex-1">
                {excludeNumbers.size > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-gray-700 mr-2">제외:</span>
                    <div className="flex space-x-1 flex-wrap">
                      {Array.from(excludeNumbers).sort((a,b) => a-b).map((number) => (
                        <LottoNumberBall 
                          key={`exclude-${number}`}
                          number={number} 
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* 포함번호 */}
              <div className="flex-1">
                {includeNumbers.size > 0 && (
                  <div className="flex items-center space-x-1 justify-end">
                    <span className="font-medium text-gray-700 mr-2">포함:</span>
                    <div className="flex space-x-1 flex-wrap">
                      {Array.from(includeNumbers).sort((a,b) => a-b).map((number) => (
                        <LottoNumberBall 
                          key={`include-${number}`}
                          number={number} 
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 연속번호 방지 */}
            {preventConsecutive && (
              <div className="text-center">
                <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  연속번호 방지 활성
                </span>
              </div>
            )}
          </div>
        )}

        {showAdvancedOptions && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">연속번호 방지</span>
              <button
                onClick={() => setPreventConsecutive(!preventConsecutive)}
                className={`w-10 h-5 rounded-full transition-all ${
                  preventConsecutive ? 'bg-pink-500' : 'bg-pink-200'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  preventConsecutive ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* 라디오버튼으로 모드 선택 */}
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <label className="flex items-center text-xs font-bold">
                  <input
                    type="radio"
                    name="numberMode"
                    value="exclude"
                    checked={numberMode === 'exclude'}
                    onChange={() => setNumberMode('exclude')}
                    className="mr-1 text-pink-500"
                  />
                  <span className="text-red-600 font-bold">제외번호</span> ({excludeNumbers.size})
                </label>
                <label className="flex items-center text-xs font-bold">
                  <input
                    type="radio"
                    name="numberMode"
                    value="include"
                    checked={numberMode === 'include'}
                    onChange={() => setNumberMode('include')}
                    className="mr-1 text-blue-500"
                  />
                  <span className="text-blue-600 font-bold">포함번호</span> ({includeNumbers.size}/6)
                </label>
              </div>
              
              <div className="grid grid-cols-9 gap-1">
                {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
                  const isExcluded = excludeNumbers.has(num);
                  const isIncluded = includeNumbers.has(num);
                  
                  return (
                    <button
                      key={`option-${num}`}
                      onClick={() => {
                        if (numberMode === 'exclude') {
                          const newSet = new Set(excludeNumbers);
                          if (isExcluded) {
                            newSet.delete(num);
                          } else {
                            newSet.add(num);
                            // 포함 목록에서도 제거
                            const includeSet = new Set(includeNumbers);
                            includeSet.delete(num);
                            setIncludeNumbers(includeSet);
                          }
                          setExcludeNumbers(newSet);
                        } else {
                          // include 모드
                          if (includeNumbers.size >= 6 && !isIncluded) return;
                          
                          const newSet = new Set(includeNumbers);
                          if (isIncluded) {
                            newSet.delete(num);
                          } else {
                            newSet.add(num);
                            // 제외 목록에서도 제거
                            const excludeSet = new Set(excludeNumbers);
                            excludeSet.delete(num);
                            setExcludeNumbers(excludeSet);
                          }
                          setIncludeNumbers(newSet);
                        }
                      }}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        isExcluded
                          ? 'bg-pink-500 text-white'
                          : isIncluded
                          ? 'bg-blue-500 text-white'
                          : numberMode === 'exclude'
                          ? 'bg-pink-100 text-gray-700 hover:bg-pink-200'
                          : numberMode === 'include' && includeNumbers.size >= 6
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {numberMode === 'exclude' ? '제외할 번호를 클릭하세요' : '포함할 번호를 클릭하세요 (최대 6개)'}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* 번호 생성 틀 - 항상 표시 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-pink-100"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-800">
            번호 생성 결과
          </span>
          {lottoNumbers.length > 0 && (
            <button
              onClick={() => setShowQRCode(true)}
              className="px-3 py-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center text-xs"
            >
              <Share2 className="w-3 h-3 mr-1" />
              QR코드
            </button>
          )}
        </div>

        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, setIndex) => {
            const hasNumbers = lottoNumbers[setIndex];
            const numbers = hasNumbers || [0, 0, 0, 0, 0, 0];
            
            return (
              <motion.div
                key={`set-${setIndex}-${Date.now()}`}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: isGenerating && setIndex > currentAnimatingSet ? 0.3 : 1
                }}
                transition={{ delay: setIndex * 0.1 }}
                className={`p-2 rounded-lg border-2 ${
                  setIndex === 0 ? 'border-pink-300 bg-pink-50' :
                  setIndex === 1 ? 'border-purple-300 bg-purple-50' :
                  setIndex === 2 ? 'border-pink-300 bg-pink-50' :
                  setIndex === 3 ? 'border-purple-300 bg-purple-50' :
                  'border-pink-300 bg-pink-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">
                    {setIndex + 1}세트
                  </span>
                  {isGenerating && setIndex === currentAnimatingSet && (
                    <span className="text-xs text-pink-600 font-medium">
                      생성중...
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  {numbers.map((number, numIndex) => (
                    hasNumbers && number > 0 ? (
                      <LottoNumberBall 
                        key={`set-${setIndex}-num-${numIndex}-${number}`}
                        number={number} 
                        size="sm"
                        isAnimating={isGenerating && setIndex === currentAnimatingSet}
                      />
                    ) : (
                      <div
                        key={`set-${setIndex}-placeholder-${numIndex}`}
                        className="w-6 h-6 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center"
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

        {/* 추첨 정보 */}
        {lottoNumbers.length > 0 && nextDrawInfo && (
          <div className="mt-3">
            {/* 회차, 추첨일, 생성시간 정보 */}
            <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Hash className="w-3 h-3 mr-1 text-blue-600" />
                    <p className="text-gray-600 font-medium">추첨예정회차</p>
                  </div>
                  <p className="text-blue-700 font-bold">제{nextDrawInfo.drawNo}회</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="w-3 h-3 mr-1 text-blue-600" />
                    <p className="text-gray-600 font-medium">추첨예정일</p>
                  </div>
                  <p className="text-blue-700 font-bold">{nextDrawInfo.drawDate}</p>
                </div>
                {generatedDateTime && (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-3 h-3 mr-1 text-green-600" />
                      <p className="text-gray-600 font-medium">생성시간</p>
                    </div>
                    <p className="text-green-700 font-bold text-xs">
                      {formatKoreanDateTime(new Date(generatedDateTime))}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {winningChance > 0 && (
          <div className="mt-3 p-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">
                맞춤 당첨확률
              </span>
              <span className="text-sm font-bold text-purple-600">
                {winningChance.toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* QR 코드 모달 */}
      {showQRCode && (
        <QRCodeGenerator 
          numbers={lottoNumbers}
          onClose={() => setShowQRCode(false)}
        />
      )}
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