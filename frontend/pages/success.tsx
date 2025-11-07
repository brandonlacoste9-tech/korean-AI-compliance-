import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';

export default function Success() {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('success_page.title')} - {t('site.title')}</title>
        <meta name="description" content={t('success_page.message')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen">
        <Header />

        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="glass rounded-2xl p-8 md:p-12">
              <div className="text-6xl mb-6">✅</div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-obangsaek-cheong mb-4">
                {t('success_page.title')}
              </h1>
              
              <p className="text-xl text-obangsaek-heuk mb-8">
                {t('success_page.message')}
              </p>

              <div className="glass-blue rounded-xl p-6 mb-8 text-left">
                <h2 className="text-xl font-bold text-obangsaek-cheong mb-4">
                  {t('success_page.next_steps')}
                </h2>
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="font-bold text-obangsaek-cheong mr-3">1.</span>
                    <span>{t('success_page.step1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-obangsaek-cheong mr-3">2.</span>
                    <span>{t('success_page.step2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-obangsaek-cheong mr-3">3.</span>
                    <span>{t('success_page.step3')}</span>
                  </li>
                </ol>
              </div>

              <Link href="/">
                <button className="btn-primary text-lg">
                  {t('success_page.back_home')}
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  };
};
