'use client';

import { motion } from 'framer-motion';
import { 
  Book, 
  Sparkles, 
  Gamepad2, 
  History, 
  Settings, 
  QrCode,
  Volume2,
  Eye,
  User,
  Calendar,
  Target,
  Trophy,
  Gift,
  AlertCircle,
  CheckCircle,
  Share2,
  RotateCcw,
  Hash
} from 'lucide-react';

export default function Manual() {
  const sections = [
    {
      id: 'overview',
      title: '앱 개요',
      icon: <Book className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            <strong>로또 번호 생성기</strong>는 생년월일과 성별을 기반으로 개인화된 로또 번호를 생성하는 앱입니다. 
            일반 모드와 게임 모드를 제공하며, 다양한 고급 옵션과 함께 몰입감 있는 오디오 및 비주얼 효과를 제공합니다.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">주요 특징</h4>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• 개인정보 기반 맞춤형 번호 생성</li>
              <li>• 실시간 당첨 시뮬레이션</li>
              <li>• 고급 필터링 옵션</li>
              <li>• 생성 이력 관리</li>
              <li>• QR코드 공유 기능</li>
              <li>• 몰입감 있는 오디오/비주얼 효과</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'general-mode',
      title: '일반 모드',
      icon: <Sparkles className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">개인 정보를 기반으로 로또 번호를 생성하는 기본 모드입니다.</p>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">개인정보 입력</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span><strong>생년월일:</strong> YYYYMMDD 형식 (예: 19901225)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span><strong>성별:</strong> 남 또는 여 선택</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">고급 옵션 설정 (선택사항)</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span><strong>제외번호:</strong> 생성에서 제외할 번호 선택</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span><strong>포함번호:</strong> 반드시 포함할 번호 선택 (최대 6개)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span><strong>연속번호 방지:</strong> 연속된 번호 생성 방지</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">번호 생성</h4>
                <p className="text-sm text-gray-600">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  <strong>번호생성</strong> 버튼을 클릭하여 5세트의 로또 번호를 생성합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">생성 결과 정보</h4>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• <Hash className="w-4 h-4 inline mr-1" />추첨예정회차 및 날짜</li>
              <li>• <Calendar className="w-4 h-4 inline mr-1" />번호 생성 시간 (한국시간)</li>
              <li>• <Trophy className="w-4 h-4 inline mr-1" />개인 맞춤 당첨확률</li>
              <li>• <QrCode className="w-4 h-4 inline mr-1" />QR코드 공유 기능</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'game-mode',
      title: '게임 모드',
      icon: <Gamepad2 className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">당첨번호를 직접 설정하여 시뮬레이션하는 모드입니다.</p>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">당첨번호 설정</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span><strong>당첨번호:</strong> 1~45 범위에서 6개 번호 입력</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gift className="w-4 h-4" />
                    <span><strong>보너스번호:</strong> 1~45 범위에서 1개 번호 입력</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>모든 번호는 중복되지 않게 입력해야 합니다</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">테스트 번호 생성</h4>
                <p className="text-sm text-gray-600">
                  일반 모드와 동일한 방식으로 5세트의 번호를 생성하여 설정한 당첨번호와 비교합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">당첨 결과 확인</h4>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">각 세트별로 당첨 등수가 실시간으로 표시됩니다:</p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span><strong>1등:</strong> 번호 6개 일치</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span><strong>2등:</strong> 번호 5개 + 보너스번호 일치</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span><strong>3등:</strong> 번호 5개 일치</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span><strong>4등:</strong> 번호 4개 일치</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span><strong>5등:</strong> 번호 3개 일치</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">게임 모드 특징</h4>
            <ul className="text-green-700 space-y-1 text-sm">
              <li>• 당첨번호와 일치하는 번호는 특별한 색상으로 표시</li>
              <li>• 당첨 등수에 따른 특별한 사운드 효과</li>
              <li>• 당첨 시 세트 배경이 빨간색으로 강조 표시</li>
              <li>• <RotateCcw className="w-4 h-4 inline mr-1" />전체 초기화로 새로운 게임 시작</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'history',
      title: '히스토리',
      icon: <History className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">생성한 모든 번호의 이력을 확인하고 관리할 수 있습니다.</p>
          
          <div className="space-y-3">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-2">히스토리에 저장되는 정보</h4>
              <ul className="text-indigo-700 space-y-1 text-sm">
                <li>• 생성된 5세트의 로또 번호</li>
                <li>• 생성 일시 (한국시간)</li>
                <li>• 사용한 생년월일과 성별</li>
                <li>• 개인 맞춤 당첨확률</li>
                <li>• 추첨예정 회차 및 날짜</li>
                <li>• 게임모드 당첨 결과 (해당시)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">히스토리 기능</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span><strong>번호 보기:</strong> 저장된 번호 세트 확인</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span><strong>QR코드 생성:</strong> 번호를 QR코드로 공유</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4" />
                  <span><strong>전체 삭제:</strong> 모든 히스토리 삭제</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">💡 히스토리 활용 팁</h4>
            <ul className="text-gray-600 space-y-1 text-sm">
              <li>• 이전에 생성한 번호와 패턴을 비교해보세요</li>
              <li>• 당첨확률이 높았던 설정을 참고하세요</li>
              <li>• QR코드로 친구들과 번호를 공유해보세요</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: '특별 기능',
      icon: <Settings className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Volume2 className="w-4 h-4 mr-2" />
                오디오 효과
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• <strong>마법 스파클:</strong> 번호 생성 시작 시</p>
                <p>• <strong>세트 생성음:</strong> 각 세트별 고유한 음계</p>
                <p>• <strong>완료 팡파레:</strong> 모든 번호 생성 완료 시</p>
                <p>• <strong>당첨 사운드:</strong> 게임모드에서 등수별 특별음</p>
                <p>• <strong>마법 차임:</strong> 부드러운 마무리음</p>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                비주얼 효과
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• <strong>번호 공 애니메이션:</strong> 부드러운 회전과 스케일 효과</p>
                <p>• <strong>세트별 색상:</strong> 핑크와 퍼플 교대 배치</p>
                <p>• <strong>생성 중 표시:</strong> 현재 생성 중인 세트 강조</p>
                <p>• <strong>당첨번호 하이라이트:</strong> 게임모드에서 일치 번호 표시</p>
                <p>• <strong>부드러운 전환:</strong> 모든 상태 변화에 애니메이션</p>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <QrCode className="w-4 h-4 mr-2" />
                QR코드 공유
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• 생성된 번호를 QR코드로 변환</p>
                <p>• 모바일에서 간편하게 스캔 가능</p>
                <p>• 로또 판매점에서 바로 사용 가능</p>
                <p>• 친구들과 번호 공유에 최적화</p>
              </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                알고리즘 특징
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• <strong>개인화:</strong> 생년월일과 성별 기반 시드 생성</p>
                <p>• <strong>시간 요소:</strong> 생성 시점의 시간도 고려</p>
                <p>• <strong>당첨확률:</strong> 나이, 성별, 생일 등을 종합 계산</p>
                <p>• <strong>필터링:</strong> 사용자 설정에 따른 번호 제외/포함</p>
                <p>• <strong>검증:</strong> 중복 방지 및 유효성 검사</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tips',
      title: '사용 팁',
      icon: <AlertCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">🎯 효과적인 사용법</h4>
              <ul className="text-yellow-700 space-y-2 text-sm">
                <li><strong>1. 정확한 정보 입력:</strong> 생년월일과 성별을 정확히 입력하세요</li>
                <li><strong>2. 고급 옵션 활용:</strong> 제외하고 싶은 번호나 포함하고 싶은 번호를 설정하세요</li>
                <li><strong>3. 게임모드 활용:</strong> 이전 당첨번호로 시뮬레이션해보세요</li>
                <li><strong>4. 히스토리 관리:</strong> 생성 패턴을 분석해보세요</li>
                <li><strong>5. 당첨확률 참고:</strong> 높은 확률일 때의 설정을 기억해두세요</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">⚡ 고급 활용법</h4>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li><strong>제외번호 전략:</strong> 최근 당첨번호나 자주 나오는 번호를 제외</li>
                <li><strong>포함번호 전략:</strong> 생일, 기념일 등 의미있는 번호 포함</li>
                <li><strong>연속번호 방지:</strong> 1,2,3 같은 연속 패턴을 피하고 싶을 때</li>
                <li><strong>게임모드 연습:</strong> 다양한 당첨번호로 확률 테스트</li>
                <li><strong>시간대 고려:</strong> 다른 시간에 생성해서 다양성 확보</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">🔧 문제 해결</h4>
              <ul className="text-green-700 space-y-2 text-sm">
                <li><strong>소리가 안 들려요:</strong> 브라우저 음소거 해제 및 볼륨 확인</li>
                <li><strong>번호가 생성되지 않아요:</strong> 생년월일과 성별이 올바른지 확인</li>
                <li><strong>애니메이션이 끊켜요:</strong> 페이지 새로고침 후 다시 시도</li>
                <li><strong>QR코드가 안 보여요:</strong> 팝업 차단 해제 확인</li>
                <li><strong>히스토리가 사라져요:</strong> 브라우저 쿠키/데이터 삭제 시 초기화됨</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <div className="flex items-center justify-center mb-4">
          <Book className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">사용 매뉴얼</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          로또 번호 생성기의 모든 기능과 사용법을 자세히 안내합니다. 
          각 섹션을 클릭하여 원하는 정보를 확인하세요.
        </p>
      </motion.div>

      {/* 매뉴얼 섹션들 */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mr-4">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                </div>
              </div>
              <div className="ml-14">
                {section.content}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 하단 연락처 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-100 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">도움이 더 필요하신가요?</h3>
        <p className="text-gray-600 mb-3">
          추가 문의사항이나 개선 제안이 있으시면 언제든 연락주세요.
        </p>
        <div className="mb-4">
          <a 
            href="mailto:jhpa670211@gmail.com" 
            className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
          >
            📧 jhpa670211@gmail.com
          </a>
        </div>
        <div className="flex items-center justify-center space-x-4 text-sm text-purple-600">
          <span>🎲 행운을 빕니다!</span>
          <span>✨ 즐거운 로또 생활 되세요!</span>
        </div>
      </motion.div>
    </div>
  );
} 