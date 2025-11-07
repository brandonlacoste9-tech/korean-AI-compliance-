import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();

  const toggleLanguage = () => {
    const newLocale = i18n.language === 'ko' ? 'en' : 'ko';
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-obangsaek-cheong/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl md:text-2xl font-bold text-obangsaek-cheong">
              {t('site.title')}
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#home" className="text-obangsaek-heuk hover:text-obangsaek-cheong transition">
              {t('header.home')}
            </a>
            <a href="#services" className="text-obangsaek-heuk hover:text-obangsaek-cheong transition">
              {t('header.services')}
            </a>
            <a href="#pricing" className="text-obangsaek-heuk hover:text-obangsaek-cheong transition">
              {t('header.pricing')}
            </a>
            <a href="#contact" className="text-obangsaek-heuk hover:text-obangsaek-cheong transition">
              {t('header.contact')}
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <span className="trust-badge text-xs">
                {t('header.msit_badge')}
              </span>
              <span className="trust-badge text-xs">
                {t('header.pipc_badge')}
              </span>
            </div>

            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-lg bg-obangsaek-cheong text-white hover:bg-obangsaek-jeok transition font-medium"
              aria-label="Toggle language"
            >
              {i18n.language === 'ko' ? 'EN' : '한국어'}
            </button>
          </div>
        </div>

        {/* Mobile trust badges */}
        <div className="flex md:hidden items-center space-x-2 mt-4 justify-center">
          <span className="trust-badge text-xs">
            {t('header.msit_badge')}
          </span>
          <span className="trust-badge text-xs">
            {t('header.pipc_badge')}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
