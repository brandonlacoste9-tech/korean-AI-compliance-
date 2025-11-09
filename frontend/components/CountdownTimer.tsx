import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = () => {
  // Korean AI Act enforcement date: January 22, 2026
  const targetDate = new Date('2026-01-22T00:00:00+09:00').getTime();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Countdown Display */}
      <div className="flex flex-wrap gap-4 justify-center">
        {/* Days */}
        <div className="glass rounded-xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px] text-center hover:shadow-lg transition-all duration-300">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-obangsaek-cheong tabular-nums">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">일</div>
        </div>

        {/* Hours */}
        <div className="glass rounded-xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px] text-center hover:shadow-lg transition-all duration-300">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-obangsaek-nokdusaek tabular-nums">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">시간</div>
        </div>

        {/* Minutes */}
        <div className="glass rounded-xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px] text-center hover:shadow-lg transition-all duration-300">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-obangsaek-hwangsaek tabular-nums">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">분</div>
        </div>

        {/* Seconds */}
        <div className="glass rounded-xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px] text-center hover:shadow-lg transition-all duration-300">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-obangsaek-hongsaek tabular-nums">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">초</div>
        </div>
      </div>

      {/* Urgency Message */}
      <div className="mt-6 text-center">
        <p className="text-lg sm:text-xl text-gray-700 font-semibold">
          한국 AI법 시행까지 남은 시간
        </p>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          2026년 1월 22일 시행 전까지 완벽하게 준비하세요
        </p>
      </div>
    </div>
  );
};

export default CountdownTimer;
