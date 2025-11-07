import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';

export default function Cancel() {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('cancel_page.title')} - {t('site.title')}</title>
        <meta name="description" content={t('cancel_page.message')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen">
        <Header />

        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="glass rounded-2xl p-8 md:p-12">
              <div className="text-6xl mb-6">❌</div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-obangsaek-jeok mb-4">
                {t('cancel_page.title')}
              </h1>
              
              <p className="text-xl text-obangsaek-heuk mb-8">
                {t('cancel_page.message')}
              </p>

              <div className="glass-blue rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-obangsaek-cheong mb-3">
                  {t('cancel_page.reason_title')}
                </h2>
                <p className="text-obangsaek-heuk">
                  {t('cancel_page.reason_text')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#pricing">
                  <button className="btn-primary text-lg">
                    {t('cancel_page.try_again')}
                  </button>
                </Link>
                <Link href="/">
                  <button className="btn-secondary text-lg">
                    {t('cancel_page.back_home')}
                  </button>
                </Link>
              </div>

              <div className="mt-8">
                <a
                  href="mailto:contact@korean-ai-compliance.kr"
                  className="text-obangsaek-cheong hover:text-obangsaek-jeok transition underline"
                >
                  {t('cancel_page.contact_us')}
                </a>
              </div>
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
