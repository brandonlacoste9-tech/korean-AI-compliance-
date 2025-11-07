import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const { t } = useTranslation('common');
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="glass rounded-2xl p-8 text-center">
      <h3 className="text-2xl font-bold text-obangsaek-jeok mb-6 pulse-urgent">
        {t('hero.countdown_title')}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-red rounded-lg p-4">
          <div className="text-4xl md:text-5xl font-bold text-obangsaek-jeok">
            {timeRemaining.days}
          </div>
          <div className="text-sm md:text-base text-obangsaek-heuk mt-2">
            {t('hero.days')}
          </div>
        </div>
        <div className="glass-blue rounded-lg p-4">
          <div className="text-4xl md:text-5xl font-bold text-obangsaek-cheong">
            {timeRemaining.hours}
          </div>
          <div className="text-sm md:text-base text-obangsaek-heuk mt-2">
            {t('hero.hours')}
          </div>
        </div>
        <div className="glass-blue rounded-lg p-4">
          <div className="text-4xl md:text-5xl font-bold text-obangsaek-cheong">
            {timeRemaining.minutes}
          </div>
          <div className="text-sm md:text-base text-obangsaek-heuk mt-2">
            {t('hero.minutes')}
          </div>
        </div>
        <div className="glass-red rounded-lg p-4">
          <div className="text-4xl md:text-5xl font-bold text-obangsaek-jeok">
            {timeRemaining.seconds}
          </div>
          <div className="text-sm md:text-base text-obangsaek-heuk mt-2">
            {t('hero.seconds')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
