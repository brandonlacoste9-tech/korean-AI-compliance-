import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const { t, i18n } = useTranslation('common');
  const isKorean = i18n.language === 'ko';

  return (
    <>
      <Head>
        <title>{isKorean ? '개인정보 처리방침 | AI 준법 가디언' : 'Privacy Policy | AI Compliance Guardian'}</title>
        <meta 
          name="description" 
          content={isKorean 
            ? 'AI 준법 가디언 개인정보 처리방침 - PIPC 준수'
            : 'AI Compliance Guardian Privacy Policy - PIPC Compliant'} 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-white to-obangsaek-baek py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-obangsaek-cheong hover:underline mb-8 inline-block">
            ← {isKorean ? '홈으로' : 'Back to Home'}
          </Link>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-black text-obangsaek-cheong mb-8">
              {isKorean ? '개인정보 처리방침' : 'Privacy Policy'}
            </h1>

            <div className="glass p-6 rounded-xl mb-8 border-2 border-obangsaek-jeok">
              <p className="text-gray-700 formal-korean">
                <strong>{isKorean ? '최종 수정일:' : 'Last Updated:'}</strong> 2024년 11월 15일 / November 15, 2024
              </p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              {/* Korean Version */}
              {isKorean ? (
                <>
                  <Section title="1. 개인정보의 수집 및 이용 목적">
                    <p className="formal-korean">
                      AI 준법 가디언(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 
                      처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
                      이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 formal-korean">
                      <li>서비스 제공 및 계약 이행</li>
                      <li>회원 관리 및 본인 확인</li>
                      <li>AI 위험 평가 및 준법 감사</li>
                      <li>고객 문의 및 지원 서비스 제공</li>
                      <li>법적 의무 준수 (PIPC, MSIT 규정)</li>
                    </ul>
                  </Section>

                  <Section title="2. 수집하는 개인정보 항목">
                    <p className="formal-korean">회사는 다음의 개인정보 항목을 수집합니다:</p>
                    <ul className="list-disc pl-6 space-y-2 formal-korean">
                      <li><strong>필수항목:</strong> 이름, 이메일 주소, 전화번호, 회사명, 직책</li>
                      <li><strong>선택항목:</strong> 주소, 팩스번호</li>
                      <li><strong>자동수집항목:</strong> IP 주소, 쿠키, 접속 로그, 서비스 이용 기록</li>
                    </ul>
                  </Section>

                  <Section title="3. 개인정보의 보유 및 이용 기간">
                    <p className="formal-korean">
                      회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
                      동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 formal-korean">
                      <li><strong>회원 정보:</strong> 회원 탈퇴 시까지</li>
                      <li><strong>감사 로그:</strong> 3년 (PIPC 규정)</li>
                      <li><strong>계약 및 청약철회 기록:</strong> 5년 (전자상거래법)</li>
                      <li><strong>소비자 불만 또는 분쟁처리 기록:</strong> 3년 (전자상거래법)</li>
                    </ul>
                  </Section>

                  <Section title="4. 개인정보의 제3자 제공">
                    <p className="formal-korean">
                      회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 
                      정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 
                      개인정보를 제3자에게 제공합니다.
                    </p>
                  </Section>

                  <Section title="5. 개인정보의 파기">
                    <p className="formal-korean">
                      회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
                      지체없이 해당 개인정보를 파기합니다.
                    </p>
                  </Section>

                  <Section title="6. 데이터 보관 위치">
                    <p className="formal-korean">
                      모든 개인정보는 <strong>대한민국 서울 리전</strong>에 위치한 데이터 센터에 보관됩니다. 
                      회사는 PIPC 및 MSIT의 데이터 거주지 요구사항을 완벽히 준수합니다.
                    </p>
                  </Section>

                  <Section title="7. 정보주체의 권리·의무 및 행사방법">
                    <p className="formal-korean">정보주체는 다음과 같은 권리를 행사할 수 있습니다:</p>
                    <ul className="list-disc pl-6 space-y-2 formal-korean">
                      <li>개인정보 열람 요구</li>
                      <li>개인정보 정정·삭제 요구</li>
                      <li>개인정보 처리정지 요구</li>
                    </ul>
                  </Section>

                  <Section title="8. 개인정보 보호책임자">
                    <p className="formal-korean">
                      회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 
                      개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 
                      아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg mt-4">
                      <p className="formal-korean"><strong>개인정보 보호책임자</strong></p>
                      <p className="formal-korean">이메일: privacy@ai-compliance-guardian.kr</p>
                      <p className="formal-korean">전화: +82-2-XXXX-XXXX</p>
                    </div>
                  </Section>

                  <Section title="9. 개인정보 처리방침 변경">
                    <p className="formal-korean">
                      이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 
                      삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                    </p>
                  </Section>
                </>
              ) : (
                /* English Version */
                <>
                  <Section title="1. Purpose of Collection and Use of Personal Information">
                    <p>
                      AI Compliance Guardian (hereinafter referred to as "the Company") processes personal information 
                      for the following purposes. Personal information being processed will not be used for purposes 
                      other than those stated below. If the purpose of use changes, we will take necessary measures 
                      such as obtaining separate consent in accordance with Article 18 of the Personal Information Protection Act.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Service provision and contract fulfillment</li>
                      <li>Member management and identity verification</li>
                      <li>AI risk assessment and compliance auditing</li>
                      <li>Customer inquiry and support services</li>
                      <li>Legal compliance (PIPC, MSIT regulations)</li>
                    </ul>
                  </Section>

                  <Section title="2. Personal Information Items Collected">
                    <p>The Company collects the following personal information items:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Required:</strong> Name, email address, phone number, company name, job title</li>
                      <li><strong>Optional:</strong> Address, fax number</li>
                      <li><strong>Automatically collected:</strong> IP address, cookies, access logs, service usage records</li>
                    </ul>
                  </Section>

                  <Section title="3. Retention and Use Period of Personal Information">
                    <p>
                      The Company processes and retains personal information within the retention and use period 
                      prescribed by law or the period consented to by the data subject at the time of collection.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Member information:</strong> Until membership withdrawal</li>
                      <li><strong>Audit logs:</strong> 3 years (PIPC regulation)</li>
                      <li><strong>Contract and withdrawal records:</strong> 5 years (E-commerce Act)</li>
                      <li><strong>Consumer complaint records:</strong> 3 years (E-commerce Act)</li>
                    </ul>
                  </Section>

                  <Section title="4. Provision of Personal Information to Third Parties">
                    <p>
                      The Company processes personal information only within the scope specified in Section 1 
                      (Purpose of Processing Personal Information) and provides personal information to third parties 
                      only when applicable under Articles 17 and 18 of the Personal Information Protection Act.
                    </p>
                  </Section>

                  <Section title="5. Destruction of Personal Information">
                    <p>
                      The Company destroys personal information without delay when it becomes unnecessary, 
                      such as when the retention period expires or the purpose of processing is achieved.
                    </p>
                  </Section>

                  <Section title="6. Data Storage Location">
                    <p>
                      All personal information is stored in data centers located in the <strong>Seoul region, Republic of Korea</strong>. 
                      The Company fully complies with PIPC and MSIT data residency requirements.
                    </p>
                  </Section>

                  <Section title="7. Rights and Obligations of Data Subjects">
                    <p>Data subjects may exercise the following rights:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Request access to personal information</li>
                      <li>Request correction or deletion of personal information</li>
                      <li>Request suspension of personal information processing</li>
                    </ul>
                  </Section>

                  <Section title="8. Personal Information Protection Officer">
                    <p>
                      The Company designates a Personal Information Protection Officer to oversee personal 
                      information processing and handle complaints and remedies related to personal information.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg mt-4">
                      <p><strong>Personal Information Protection Officer</strong></p>
                      <p>Email: privacy@ai-compliance-guardian.kr</p>
                      <p>Phone: +82-2-XXXX-XXXX</p>
                    </div>
                  </Section>

                  <Section title="9. Changes to Privacy Policy">
                    <p>
                      This Privacy Policy is effective from the date of implementation. If there are additions, 
                      deletions, or corrections to the content according to laws and policies, we will notify 
                      you through announcements at least 7 days before the changes take effect.
                    </p>
                  </Section>
                </>
              )}
            </div>

            {/* Compliance Notice */}
            <div className="mt-12 glass p-8 rounded-xl border-2 border-obangsaek-cheong">
              <h2 className="text-2xl font-bold text-obangsaek-cheong mb-4">
                {isKorean ? '🇰🇷 준법 공지' : '🇰🇷 Compliance Notice'}
              </h2>
              <p className="text-gray-700 formal-korean mb-4">
                {isKorean
                  ? '본 개인정보 처리방침은 한국 개인정보 보호법, PIPC 규정, 그리고 2026년 1월 22일부터 시행되는 AI 기본법을 완벽히 준수합니다.'
                  : 'This Privacy Policy fully complies with the Korean Personal Information Protection Act, PIPC regulations, and the AI Basic Act effective from January 22, 2026.'}
              </p>
              <div className="flex gap-4">
                <span className="compliance-badge compliance-badge-pipc">PIPC 준수</span>
                <span className="compliance-badge compliance-badge-msit">MSIT 인증</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-obangsaek-cheong mb-4">{title}</h2>
      <div className="text-gray-700 space-y-4">{children}</div>
    </section>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common'])),
    },
  };
};
