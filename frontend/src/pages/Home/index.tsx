import { useState } from "react";
import HeroSection from "../../components/HeroSection";
import KakaoMap from "../../components/common/KakaoMap"; // KakaoMap 경로 확인 필요
import ThemeSection from "../../components/common/ThemeSection";
import * as S from "./style";

const Home = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <>
      {/* 1. 메인 히어로 섹션 */}
      <HeroSection />

      {/* 2. 소개 & 오시는 길 섹션 */}
      <S.Section id="about">
        <S.Container>
          <S.SectionTitle>아쿠아리움 소개</S.SectionTitle>
          <S.AboutGrid>
            {/* 왼쪽: 텍스트 정보 */}
            <div>
              <h3
                style={{
                  fontSize: "24px",
                  marginBottom: "20px",
                  color: "#fff",
                }}
              >
                심해의 비밀을 간직한 연구소
              </h3>
              <p style={{ color: "var(--text-gray)", marginBottom: "30px" }}>
                Naquarium Archive는 단순한 수족관이 아닙니다. <br />
                멸종 위기종을 디지털로 복원하고, 미지의 심해 생태계를 연구하는
                <br />
                가상의 해저 기지입니다.
              </p>

              <S.InfoBox>
                <h4 style={{ marginBottom: "15px", color: "#fff" }}>
                  이용 요금 및 운영 시간
                </h4>
                <S.InfoItem>
                  <span>성인 (19세 이상)</span> <span>35,000원</span>
                </S.InfoItem>
                <S.InfoItem>
                  <span>청소년 (13세~18세)</span> <span>28,000원</span>
                </S.InfoItem>
                <S.InfoItem>
                  <span>운영 시간</span> <span>10:00 - 22:00</span>
                </S.InfoItem>
                <S.InfoItem style={{ border: "none", color: "#ff6b6b" }}>
                  <span>휴관일</span> <span>매월 첫째주 월요일</span>
                </S.InfoItem>
              </S.InfoBox>
            </div>

            {/* 오른쪽: 지도 (KakaoMap) */}
            <div>
              <h4 style={{ marginBottom: "15px", color: "#fff" }}>
                찾아오시는 길
              </h4>
              <S.MapWrapper>
                <KakaoMap />
              </S.MapWrapper>
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  color: "var(--text-gray)",
                }}
              >
                인천광역시 계양구 아라뱃길 해저 2터미널 (가상 위치)
              </p>
            </div>
          </S.AboutGrid>
        </S.Container>
      </S.Section>

      {/* 3. 테마 전시 섹션 */}
      <ThemeSection />

      {/* 4. 프로그램 & 일정 섹션 */}
      <S.Section id="programs">
        <S.Container>
          <S.SectionTitle>프로그램 & 일정</S.SectionTitle>
          <S.ProgramLayout>
            <S.ProgramCol>
              <h3
                style={{
                  marginBottom: "30px",
                  color: "var(--accent-cyan)",
                  borderLeft: "4px solid var(--accent-cyan)",
                  paddingLeft: "15px",
                }}
              >
                체험 프로그램
              </h3>
              <img
                src="https://placehold.co/500x200/222/FFF?text=Diving+Experience"
                alt="VR체험"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginBottom: "20px",
                }}
              />
              <h4 style={{ marginBottom: "10px", color: "#fff" }}>
                가상 심해 다이빙 (VR)
              </h4>
              <p style={{ fontSize: "14px", color: "var(--text-gray)" }}>
                실제 물에 들어가지 않고도 심해 3,000m를 탐험하는 VR 체험입니다.
                거대한 대왕오징어와 향유고래의 전투를 눈앞에서 목격하세요.
              </p>
            </S.ProgramCol>

            <S.ProgramCol>
              <h3
                style={{
                  marginBottom: "30px",
                  color: "var(--accent-cyan)",
                  borderLeft: "4px solid var(--accent-cyan)",
                  paddingLeft: "15px",
                }}
              >
                공연 시간표 (Today)
              </h3>
              <S.ScheduleTable>
                <thead>
                  <tr>
                    <th>시간</th>
                    <th>공연명</th>
                    <th>장소</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>11:00</td>
                    <td>돌고래의 꿈 (디지털)</td>
                    <td>오션 아레나</td>
                    <td style={{ color: "#ff6b6b" }}>마감</td>
                  </tr>
                  <tr>
                    <td>14:00</td>
                    <td>심해의 빛 쇼</td>
                    <td>딥 블루 홀</td>
                    <td style={{ color: "var(--accent-cyan)" }}>예매가능</td>
                  </tr>
                  <tr>
                    <td>16:00</td>
                    <td>펭귄 생태 설명회</td>
                    <td>극지방 존</td>
                    <td style={{ color: "var(--accent-cyan)" }}>예매가능</td>
                  </tr>
                  <tr>
                    <td>19:00</td>
                    <td>나이트 라군 파티</td>
                    <td>중앙 광장</td>
                    <td style={{ color: "var(--text-gray)" }}>준비중</td>
                  </tr>
                </tbody>
              </S.ScheduleTable>
            </S.ProgramCol>
          </S.ProgramLayout>
        </S.Container>
      </S.Section>

      {/* 5. 예매 배너 섹션 */}
      <S.BookingSection id="booking">
        <h2>지금 바로, 미지의 바다를 예약하세요</h2>
        <p>회원가입 시 1,000 포인트 즉시 지급!</p>
        <button onClick={() => alert("준비중입니다.")}>
          예매 페이지로 이동 ➔
        </button>
      </S.BookingSection>

      {/* 6. 커뮤니티 섹션 */}
      <S.Section id="community">
        <S.Container>
          <S.SectionTitle>커뮤니티</S.SectionTitle>
          <S.CommunityGrid>
            {/* FAQ */}
            <S.CommBox>
              <S.CommTitle>
                자주 묻는 질문 <span>+</span>
              </S.CommTitle>
              {[
                {
                  q: "예매 취소는 언제까지 가능한가요?",
                  a: "관람일 전일 23:59까지 100% 환불 가능합니다.",
                },
                {
                  q: "주차장 이용 안내",
                  a: "지하 2층부터 4층까지 무료로 이용 가능합니다.",
                },
                {
                  q: "음식물 반입이 되나요?",
                  a: "음료를 제외한 음식물 반입은 제한됩니다.",
                },
              ].map((item, idx) => (
                <S.FaqItem
                  key={idx}
                  $active={activeFaq === idx}
                  onClick={() => toggleFaq(idx)}
                >
                  <div className="question">Q. {item.q}</div>
                  <div className="answer">{item.a}</div>
                </S.FaqItem>
              ))}
            </S.CommBox>

            {/* 후기 */}
            <S.CommBox>
              <S.CommTitle>
                관람 후기 <span>more</span>
              </S.CommTitle>
              <S.CommList>
                <li>
                  <span>[포토] 빛의 바다 아름다워요!</span>{" "}
                  <span style={{ color: "#ffdd57" }}>★ 5.0</span>
                </li>
                <li>
                  <span>아이들이 VR 좋아하네요.</span>{" "}
                  <span style={{ color: "#ffdd57" }}>★ 4.5</span>
                </li>
                <li>
                  <span>돌고래 공연 감동적...</span>{" "}
                  <span style={{ color: "#ffdd57" }}>★ 5.0</span>
                </li>
                <li>
                  <span>주말엔 사람이 많네요.</span>{" "}
                  <span style={{ color: "#ffdd57" }}>★ 4.0</span>
                </li>
                <li>
                  <span>재방문 의사 있습니다!</span>{" "}
                  <span style={{ color: "#ffdd57" }}>★ 5.0</span>
                </li>
              </S.CommList>
            </S.CommBox>

            {/* 자유게시판 */}
            <S.CommBox>
              <S.CommTitle>
                자유 게시판 <span>more</span>
              </S.CommTitle>
              <S.CommList>
                <li>
                  <span>같이 가실 분 구해요 (인천)</span>
                </li>
                <li>
                  <span>굿즈샵에 펭귄 인형 있나요?</span>
                </li>
                <li>
                  <span>이번 시즌 포토존 위치 공유</span>
                </li>
                <li>
                  <span>홈페이지 디자인 멋지네요</span>
                </li>
                <li>
                  <span>심해 물고기 이름 뭔가요?</span>
                </li>
              </S.CommList>
            </S.CommBox>
          </S.CommunityGrid>
        </S.Container>
      </S.Section>
    </>
  );
};

export default Home;
