'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice6, Calendar, Trophy, History, Settings, Book } from 'lucide-react';
import LottoGenerator from '@/components/LottoGenerator';
import WinningNumbers from '@/components/WinningNumbers';
import LottoHistory from '@/components/LottoHistory';
import GameMode from '@/components/GameMode';
import Manual from '@/components/Manual';
import { initializeAudio } from '@/utils/audioEffects';

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [userInfo, setUserInfo] = useState({
    birthDate: '',
    gender: ''
  });

  // 오디오 초기화 (클라이언트에서만)
  useEffect(() => {
    initializeAudio();
  }, []);

  const tabs = [
    { id: 0, name: '번호생성', icon: Dice6, component: LottoGenerator },
    { id: 1, name: '당첨번호', icon: Trophy, component: WinningNumbers },
    { id: 2, name: '기록', icon: History, component: LottoHistory },
    { id: 3, name: '게임모드', icon: Settings, component: GameMode },
    { id: 4, name: '매뉴얼', icon: Book, component: Manual },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-100 to-purple-100 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Dice6 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">톱니바꿈의 로또번호 자동 생성기</h1>
                <p className="text-xs text-gray-600">AI 기반 맞춤형 번호 생성</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-xs text-gray-600">
              <Calendar className="w-3 h-3" />
              <span>{new Date().toLocaleDateString('ko-KR')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-1.5 mb-4 border border-pink-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 px-2 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-pink-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium text-xs">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={`mx-auto px-4 pb-6 ${activeTab === 4 ? 'max-w-6xl' : 'max-w-2xl'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 0 && <LottoGenerator userInfo={userInfo} setUserInfo={setUserInfo} />}
            {activeTab === 1 && <WinningNumbers />}
            {activeTab === 2 && <LottoHistory userInfo={userInfo} />}
            {activeTab === 3 && <GameMode userInfo={userInfo} />}
            {activeTab === 4 && <Manual />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 