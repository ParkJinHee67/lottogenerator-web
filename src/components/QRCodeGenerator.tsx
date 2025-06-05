'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Share2 } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  numbers: number[][];
  onClose: () => void;
}

export default function QRCodeGenerator({ numbers, onClose }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateQRCode();
  }, [numbers]);

  const generateQRCode = async () => {
    try {
      setIsLoading(true);
      
      // 번호 데이터를 문자열로 변환
      const data = {
        title: '🎯 로또번호 생성기',
        date: new Date().toLocaleDateString('ko-KR'),
        numbers: numbers.map((set, index) => ({
          set: index + 1,
          numbers: set
        })),
        url: window.location.origin
      };
      
      const qrString = JSON.stringify(data, null, 2);
      
      // QR 코드 생성
      const qrDataUrl = await QRCode.toDataURL(qrString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1F2937',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('QR 코드 생성 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `lotto-numbers-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareQRCode = async () => {
    if (!qrCodeUrl) return;
    
    try {
      // Web Share API가 지원되는 경우
      if (navigator.share) {
        // Data URL을 Blob으로 변환
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], 'lotto-qr.png', { type: 'image/png' });
        
        await navigator.share({
          title: '로또번호 QR코드',
          text: '생성된 로또번호를 QR코드로 공유합니다.',
          files: [file]
        });
      } else {
        // 클립보드에 복사
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        alert('QR코드가 클립보드에 복사되었습니다!');
      }
    } catch (error) {
      console.error('공유 실패:', error);
      // 대체 방법: 다운로드
      downloadQRCode();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">QR 코드</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code */}
        <div className="text-center mb-6">
          {isLoading ? (
            <div className="w-[300px] h-[300px] mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : qrCodeUrl ? (
            <div className="bg-white p-4 rounded-lg shadow-lg inline-block">
              <img 
                src={qrCodeUrl} 
                alt="로또번호 QR코드" 
                className="w-[300px] h-[300px]"
              />
            </div>
          ) : (
            <div className="w-[300px] h-[300px] mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">QR 코드 생성 실패</span>
            </div>
          )}
        </div>

        {/* 번호 미리보기 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">포함된 번호</h4>
          <div className="space-y-2">
            {numbers.map((set, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{index + 1}세트</span>
                <div className="flex space-x-1">
                  {set.map((num, numIndex) => (
                    <span 
                      key={numIndex}
                      className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 설명 */}
        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            📱 QR코드를 스캔하면 생성된 번호 정보를 확인할 수 있습니다.
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex space-x-3">
          <button
            onClick={downloadQRCode}
            disabled={!qrCodeUrl}
            className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            다운로드
          </button>
          <button
            onClick={shareQRCode}
            disabled={!qrCodeUrl}
            className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Share2 className="w-4 h-4 mr-2" />
            공유
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 