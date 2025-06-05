// 매직 사운드 효과 유틸리티 (SSR 안전) - 화려한 버전

class AudioEffects {
  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;

  constructor() {
    // SSR에서는 아무것도 하지 않음
  }

  private async ensureAudioContext() {
    // 브라우저 환경이 아니면 false 반환
    if (typeof window === 'undefined') return false;
    
    if (!this.audioContext && !this.isInitialized) {
      this.isInitialized = true;
      try {
        // @ts-ignore
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioContext = new AudioContextClass();
        }
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
        return false;
      }
    }
    
    return !!this.audioContext;
  }

  async playMagicSparkle(frequency = 800, duration = 0.6) {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    try {
      // 메인 반짝이는 소리
      this.createSparkleOscillator(frequency, duration, 0);
      
      // 하모닉 추가 (더 풍성한 소리)
      setTimeout(() => {
        this.createSparkleOscillator(frequency * 1.5, duration * 0.8, 0);
      }, 50);
      
      // 에코 효과
      setTimeout(() => {
        this.createSparkleOscillator(frequency * 0.75, duration * 0.6, 0);
      }, 100);
      
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  }

  private createSparkleOscillator(frequency: number, duration: number, delay: number) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();
    const convolver = this.audioContext.createConvolver();

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime + delay);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 3, this.audioContext.currentTime + delay + duration * 0.2);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.3, this.audioContext.currentTime + delay + duration);

    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(3000, this.audioContext.currentTime + delay);
    filterNode.frequency.exponentialRampToValueAtTime(8000, this.audioContext.currentTime + delay + duration * 0.3);
    filterNode.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + delay + duration);
    filterNode.Q.setValueAtTime(2, this.audioContext.currentTime + delay);

    gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime + delay);
    gainNode.gain.exponentialRampToValueAtTime(0.4, this.audioContext.currentTime + delay + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + delay + duration);

    oscillator.start(this.audioContext.currentTime + delay);
    oscillator.stop(this.audioContext.currentTime + delay + duration);
  }

  async playMagicChime(baseFreq = 523.25, duration = 1.0) {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    try {
      // 더 풍성한 화음 구성 (C Major 7th chord)
      const frequencies = [
        baseFreq,           // C
        baseFreq * 1.25,    // E 
        baseFreq * 1.5,     // G
        baseFreq * 1.875,   // B
        baseFreq * 2.0      // C 옥타브
      ];
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.createChimeNote(freq, duration, index * 0.1);
        }, index * 150);
      });
      
      // 리버브 효과를 위한 추가 노트들
      setTimeout(() => {
        frequencies.forEach((freq, index) => {
          this.createChimeNote(freq * 0.5, duration * 1.5, index * 0.05);
        });
      }, 400);
      
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  }

  private createChimeNote(frequency: number, duration: number, delay: number) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime + delay);
    
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(frequency * 4, this.audioContext.currentTime + delay);
    filterNode.Q.setValueAtTime(1, this.audioContext.currentTime + delay);
    
    gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime + delay);
    gainNode.gain.exponentialRampToValueAtTime(0.3, this.audioContext.currentTime + delay + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + delay + duration);
    
    oscillator.start(this.audioContext.currentTime + delay);
    oscillator.stop(this.audioContext.currentTime + delay + duration);
  }

  async playGenerationComplete() {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    try {
      // 대형 팡파레 - 오케스트라 느낌
      const fanfareNotes = [
        { freq: 261.63, delay: 0 },     // C4
        { freq: 329.63, delay: 0.1 },   // E4
        { freq: 392.00, delay: 0.2 },   // G4
        { freq: 523.25, delay: 0.3 },   // C5
        { freq: 659.25, delay: 0.4 },   // E5
        { freq: 783.99, delay: 0.5 },   // G5
        { freq: 1046.50, delay: 0.6 },  // C6
      ];
      
      fanfareNotes.forEach(({ freq, delay }) => {
        this.createFanfareNote(freq, 0.8, delay);
        // 하모닉 추가
        this.createFanfareNote(freq * 1.5, 0.6, delay + 0.1);
      });
      
      // 드럼롤 효과
      setTimeout(() => {
        this.playDrumRoll(0.5);
      }, 200);
      
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  }

  private createFanfareNote(frequency: number, duration: number, delay: number) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime + delay);
    
    gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime + delay);
    gainNode.gain.exponentialRampToValueAtTime(0.5, this.audioContext.currentTime + delay + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + delay + duration);
    
    oscillator.start(this.audioContext.currentTime + delay);
    oscillator.stop(this.audioContext.currentTime + delay + duration);
  }

  private playDrumRoll(duration: number) {
    if (!this.audioContext) return;
    
    const rollCount = Math.floor(duration * 20); // 20 hits per second
    
    for (let i = 0; i < rollCount; i++) {
      setTimeout(() => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();
        const filterNode = this.audioContext!.createBiquadFilter();
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(80 + Math.random() * 40, this.audioContext!.currentTime);
        
        filterNode.type = 'highpass';
        filterNode.frequency.setValueAtTime(1000, this.audioContext!.currentTime);
        
        gainNode.gain.setValueAtTime(0.001, this.audioContext!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.2, this.audioContext!.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 0.05);
        
        oscillator.start(this.audioContext!.currentTime);
        oscillator.stop(this.audioContext!.currentTime + 0.05);
      }, i * (duration * 1000 / rollCount));
    }
  }

  async playSlotSpin() {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    try {
      // 슬롯머신 스타일의 빠른 회전음
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filterNode = this.audioContext.createBiquadFilter();

      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(50, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(20, this.audioContext.currentTime + 0.7);

      filterNode.type = 'bandpass';
      filterNode.frequency.setValueAtTime(2000, this.audioContext.currentTime);
      filterNode.frequency.exponentialRampToValueAtTime(8000, this.audioContext.currentTime + 0.3);
      filterNode.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.7);
      filterNode.Q.setValueAtTime(3, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.7);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.7);
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  }

  async playSetGeneration(setIndex: number) {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    try {
      // 각 세트마다 다른 음계와 리듬
      const scales = [
        [440, 494, 523],      // A-B-C (1세트)
        [523, 587, 659],      // C-D-E (2세트) 
        [659, 740, 831],      // E-F#-G# (3세트)
        [831, 932, 1047],     // G#-A#-C (4세트)
        [1047, 1175, 1319]    // C-D-E (5세트 옥타브)
      ];
      
      const currentScale = scales[setIndex % scales.length];
      
      // 3음 화음으로 재생
      currentScale.forEach((freq, noteIndex) => {
        setTimeout(() => {
          this.playSetNote(freq, 0.3);
        }, noteIndex * 100);
      });
      
      // 마지막에 모든 음을 화음으로
      setTimeout(() => {
        currentScale.forEach(freq => {
          this.playSetNote(freq, 0.5);
        });
      }, 300);
      
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  }

  private playSetNote(frequency: number, duration: number) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  async playWinFanfare() {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    try {
      // 초대형 당첨 팡파레
      const bigFanfareNotes = [
        { freq: 261.63, delay: 0 },      // C4
        { freq: 329.63, delay: 0.15 },   // E4
        { freq: 392.00, delay: 0.3 },    // G4
        { freq: 523.25, delay: 0.45 },   // C5
        { freq: 659.25, delay: 0.6 },    // E5
        { freq: 783.99, delay: 0.75 },   // G5
        { freq: 1046.50, delay: 0.9 },   // C6
        { freq: 1318.51, delay: 1.05 },  // E6
      ];
      
      bigFanfareNotes.forEach(({ freq, delay }) => {
        // 메인 팡파레
        this.createWinNote(freq, 1.2, delay);
        // 하모닉
        this.createWinNote(freq * 1.5, 1.0, delay + 0.1);
        // 베이스
        this.createWinNote(freq * 0.5, 1.5, delay);
      });
      
      // 글리터 효과 (반짝이는 소리들)
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const freq = 1000 + Math.random() * 2000;
          this.playMagicSparkle(freq, 0.2);
        }, i * 50);
      }
      
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  }

  private createWinNote(frequency: number, duration: number, delay: number) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime + delay);
    
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(frequency * 6, this.audioContext.currentTime + delay);
    filterNode.Q.setValueAtTime(1.5, this.audioContext.currentTime + delay);
    
    gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime + delay);
    gainNode.gain.exponentialRampToValueAtTime(0.6, this.audioContext.currentTime + delay + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + delay + duration);
    
    oscillator.start(this.audioContext.currentTime + delay);
    oscillator.stop(this.audioContext.currentTime + delay + duration);
  }

  async playExplosion() {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    try {
      // 더 임팩트 있는 폭발음
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filterNode = this.audioContext.createBiquadFilter();

      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(20, this.audioContext.currentTime + 0.5);

      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(2000, this.audioContext.currentTime);
      filterNode.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);

      gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.8, this.audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
      
      // 추가 크래쉬 사운드
      setTimeout(() => {
        this.playCrashSound();
      }, 100);
      
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  }

  private playCrashSound() {
    if (!this.audioContext) return;
    
    // 화이트 노이즈 기반 크래쉬
    const bufferSize = this.audioContext.sampleRate * 0.3;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();
    
    source.buffer = buffer;
    source.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    filterNode.type = 'bandpass';
    filterNode.frequency.setValueAtTime(3000, this.audioContext.currentTime);
    filterNode.Q.setValueAtTime(0.5, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
    
    source.start(this.audioContext.currentTime);
  }

  async playWinByRank(rank: string) {
    if (!(await this.ensureAudioContext()) || !this.audioContext) return;

    try {
      switch (rank) {
        case '1등':
          await this.playWinFanfare();
          setTimeout(() => this.playExplosion(), 1000);
          // 추가 축하 소리
          setTimeout(() => {
            for (let i = 0; i < 10; i++) {
              setTimeout(() => {
                this.playMagicSparkle(800 + Math.random() * 1000, 0.3);
              }, i * 100);
            }
          }, 1500);
          break;
        case '2등':
        case '3등':
          await this.playWinFanfare();
          setTimeout(() => {
            this.playMagicChime(523.25, 2.0);
          }, 800);
          break;
        case '4등':
        case '5등':
          await this.playMagicChime(440, 1.5);
          setTimeout(() => {
            this.playMagicSparkle(660, 1.0);
          }, 500);
          break;
        default:
          await this.playMagicSparkle(400, 1.0);
          break;
      }
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  }
}

// 전역 인스턴스 생성
let audioEffectsInstance: AudioEffects | null = null;

// 사용자 첫 인터랙션 시 오디오 컨텍스트 활성화
export const initializeAudio = () => {
  if (typeof window !== 'undefined') {
    const initialize = () => {
      // 첫 클릭 시 오디오 컨텍스트를 미리 준비
      audioEffects.playMagicSparkle(0.001, 0.001); // 무음으로 초기화
      document.removeEventListener('click', initialize);
      document.removeEventListener('touchstart', initialize);
    };
    
    document.addEventListener('click', initialize, { once: true });
    document.addEventListener('touchstart', initialize, { once: true });
  }
}; 
