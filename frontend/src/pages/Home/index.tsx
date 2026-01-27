import { useState } from "react";
// Header, Footer import 삭제! (App.tsx에서 이미 포함함)
import HeroSection from "../../components/HeroSection";
import KakaoMap from "../../components/common/KakaoMap";
import ThemeSection from "../../components/common/ThemeSection";
import * as S from "./style";

const Home = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. About */}
      <S.Section id="about">
        <S.Container>
          <S.SectionTitle>아쿠아리움 소개</S.SectionTitle>
          <S.AboutGrid>
            {/* ... 내용 유지 ... */}
            <div>
              <h3>심해의 비밀을 간직한 연구소</h3>
              {/* ... (중략) ... */}
            </div>
            <div>
              <h4>찾아오시는 길</h4>
              <S.MapWrapper>
                <KakaoMap />
              </S.MapWrapper>
              {/* ... */}
            </div>
          </S.AboutGrid>
        </S.Container>
      </S.Section>

      {/* 3. Theme */}
      <ThemeSection />

      {/* 4. Programs */}
      <S.Section id="programs">
        <S.Container>
          {/* ... 내용 유지 ... */}
          <S.SectionTitle>프로그램 & 일정</S.SectionTitle>
          <S.ProgramLayout>{/* ... */}</S.ProgramLayout>
        </S.Container>
      </S.Section>

      {/* 5. Booking */}
      <S.BookingSection id="booking">
        {/* 여기는 Container 없어도 됨 (텍스트만 있으므로) */}
        <h2>지금 바로, 미지의 바다를 예약하세요</h2>
        <p>회원가입 시 1,000 포인트 즉시 지급!</p>
        <button onClick={() => alert("준비중")}>예매 페이지로 이동 ➔</button>
      </S.BookingSection>

      {/* 6. Community */}
      <S.Section id="community">
        <S.Container>
          <S.SectionTitle>커뮤니티</S.SectionTitle>
          <S.CommunityGrid>{/* ... */}</S.CommunityGrid>
        </S.Container>
      </S.Section>
    </>
  );
};

export default Home;
