import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const { t, i18n } = useTranslation('common');
  const targetDate = new Date('2026-01-22T00:00:00+09:00');
  
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isKorean = i18n.language === 'ko';

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-obangsaek-cheong">
          {isKorean ? '🇰🇷 AI 기본법 시행일까지' : '🇰🇷 Time Until AI Basic Act'}
        </h2>
        
        <div className="text-center mb-6">
          <p className="text-lg md:text-xl text-gray-700 formal-korean">
            {isKorean 
              ? '2026년 1월 22일 (수) 오전 12시' 
              : 'January 22, 2026 (Wed) 00:00 KST'}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 md:gap-8">
          <TimeUnit value={timeLeft.days} label={isKorean ? '일' : 'Days'} />
          <TimeUnit value={timeLeft.hours} label={isKorean ? '시간' : 'Hours'} />
          <TimeUnit value={timeLeft.minutes} label={isKorean ? '분' : 'Minutes'} />
          <TimeUnit value={timeLeft.seconds} label={isKorean ? '초' : 'Seconds'} />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 formal-korean">
            {isKorean
              ? '준비 시간이 얼마 남지 않았습니다. 지금 시작하세요!'
              : "Time is running out. Start preparing now!"}
          </p>
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="countdown-digit mb-2">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-sm md:text-base font-semibold text-gray-600 uppercase">
        {label}
      </div>
    </div>
  );
}
