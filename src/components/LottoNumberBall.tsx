'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LottoNumberBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  isAnimating?: boolean;
  isWinning?: boolean;
  isBonus?: boolean;
}

export default function LottoNumberBall({ 
  number, 
  size = 'md', 
  isAnimating = false,
  isWinning = false,
  isBonus = false 
}: LottoNumberBallProps) {
  
  const [displayNumber, setDisplayNumber] = useState(number);
  const [isSlotAnimating, setIsSlotAnimating] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      setIsSlotAnimating(true);
      setShowParticles(true);
      
      // 슬롯머신 효과: 빠르게 숫자들을 돌림
      const interval = setInterval(() => {
        setDisplayNumber(Math.floor(Math.random() * 45) + 1);
      }, 80); // 더 빠른 회전

      // 2초 후 실제 번호로 정착
      setTimeout(() => {
        clearInterval(interval);
        setDisplayNumber(number);
        setIsSlotAnimating(false);
        
        // 정착 후 파티클 완전히 제거
        setTimeout(() => {
          setShowParticles(false);
        }, 500); // 파티클을 더 빨리 제거
      }, 1800);

      return () => clearInterval(interval);
    } else {
      // 애니메이션이 아닐 때는 모든 효과 즉시 정지
      setDisplayNumber(number);
      setIsSlotAnimating(false);
      setShowParticles(false);
    }
  }, [isAnimating, number]);
  
  // 번호 범위에 따른 색상 결정 (로또 공식 색상)
  const getColor = () => {
    if (isBonus) return 'bg-gray-600'; // 보너스 번호는 회색
    
    if (displayNumber >= 1 && displayNumber <= 10) return 'bg-yellow-500'; // 노란색
    if (displayNumber >= 11 && displayNumber <= 20) return 'bg-blue-500'; // 파란색
    if (displayNumber >= 21 && displayNumber <= 30) return 'bg-red-500'; // 빨간색
    if (displayNumber >= 31 && displayNumber <= 40) return 'bg-gray-500'; // 회색
    if (displayNumber >= 41 && displayNumber <= 45) return 'bg-green-500'; // 초록색
    
    return 'bg-gray-400';
  };

  // 글로우 색상
  const getGlowColor = () => {
    if (isBonus) return 'shadow-gray-500/50';
    
    if (displayNumber >= 1 && displayNumber <= 10) return 'shadow-yellow-500/50';
    if (displayNumber >= 11 && displayNumber <= 20) return 'shadow-blue-500/50';
    if (displayNumber >= 21 && displayNumber <= 30) return 'shadow-red-500/50';
    if (displayNumber >= 31 && displayNumber <= 40) return 'shadow-gray-500/50';
    if (displayNumber >= 41 && displayNumber <= 45) return 'shadow-green-500/50';
    
    return 'shadow-gray-400/50';
  };

  // 크기에 따른 스타일
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-xs';
      case 'lg':
        return 'w-12 h-12 text-lg';
      default:
        return 'w-10 h-10 text-sm';
    }
  };

  // 파티클 생성 함수
  const generateParticles = () => {
    return Array.from({ length: 8 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full"
        initial={{ 
          x: 0, 
          y: 0, 
          scale: 0,
          opacity: 0 
        }}
        animate={showParticles ? {
          x: [0, (Math.cos(i * 45 * Math.PI / 180) * 30)],
          y: [0, (Math.sin(i * 45 * Math.PI / 180) * 30)],
          scale: [0, 1, 0],
          opacity: [0, 1, 0]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: showParticles ? Infinity : 0,
          repeatDelay: 0.5,
          ease: "easeOut"
        }}
        style={{
          left: '50%',
          top: '50%',
        }}
      />
    ));
  };

  return (
    <div className="relative">
      {/* 파티클 효과 - 애니메이션 중일 때만 */}
      {showParticles && isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          {generateParticles()}
        </div>
      )}
      
      <motion.div
        className={`
          ${getSizeClasses()}
          ${getColor()}
          ${(isAnimating || isWinning) ? getGlowColor() : ''}
          ${isWinning ? 'ring-4 ring-pink-300 ring-opacity-75' : ''}
          ${isBonus ? 'ring-2 ring-purple-400 ring-opacity-75' : ''}
          rounded-full
          flex items-center justify-center
          text-white font-bold
          shadow-xl
          relative
          overflow-hidden
          backdrop-blur-sm
        `}
        initial={isAnimating ? { 
          scale: 0, 
          rotate: -360,
          x: -100,
          opacity: 0
        } : { scale: 1 }}
        animate={
          isAnimating ? { 
            scale: [0, 1.5, 0.9, 1.1, 1], 
            rotate: [-360, 0, 0, 0, 0],
            x: [-100, 20, -10, 5, 0],
            y: isSlotAnimating ? [0, -8, 0] : [0, -20, 10, -5, 0],
            opacity: [0, 0.7, 1, 1, 1]
          } : { 
            scale: 1,
            rotate: 0,
            x: 0,
            y: 0,
            opacity: 1
          }
        }
        transition={
          isAnimating ? {
            duration: 2,
            ease: [0.25, 0.46, 0.45, 0.94],
            times: [0, 0.4, 0.6, 0.8, 1]
          } : {
            duration: 0.3,
            ease: "easeOut"
          }
        }
        whileHover={{ 
          scale: 1.15,
          rotateY: 15,
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: 0.9,
          rotateX: 10
        }}
      >
        {/* 메인 그라데이션 배경 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-black/20" />
        
        {/* 숫자 */}
        <motion.span 
          className="relative z-20 drop-shadow-lg"
          animate={isSlotAnimating && isAnimating ? { 
            y: [-30, 0, 30, 0],
            opacity: [0.2, 1, 0.2, 1],
            scale: [0.8, 1.2, 0.8, 1]
          } : {}}
          transition={isSlotAnimating && isAnimating ? {
            duration: 0.15,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        >
          {displayNumber}
        </motion.span>
        
        {/* 슬롯머신 스피드라인 효과 - 애니메이션 중일 때만 */}
        {isSlotAnimating && isAnimating && (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 0.3, 
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute inset-2 bg-white opacity-30 rounded-full blur-sm"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 0.2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </>
        )}
        
        {/* 당첨 번호 펄스 효과 */}
        {isWinning && !isSlotAnimating && (
          <>
            <motion.div
              className="absolute inset-0 bg-pink-300 opacity-20 rounded-full"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -inset-2 bg-pink-400 opacity-10 rounded-full blur-sm"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </>
        )}
        
        {/* 보너스 번호 표시 */}
        {isBonus && (
          <>
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              B
            </motion.div>
            <motion.div
              className="absolute -inset-1 bg-purple-400 opacity-20 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </>
        )}
        
        {/* 3D 하이라이트 효과들 */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-white opacity-60 rounded-full blur-[1px]" />
        <div className="absolute top-2 left-2 w-1 h-1 bg-white opacity-80 rounded-full" />
        <div className="absolute bottom-1 right-1 w-2 h-2 bg-black opacity-20 rounded-full blur-[1px]" />
        
        {/* 환상적인 오라 효과 - 애니메이션 중일 때만 */}
        {(isAnimating || showParticles) && (
          <motion.div
            className={`absolute -inset-4 rounded-full blur-md ${getColor()}/30`}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </div>
  );
} 