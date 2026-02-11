import KakaoMap from "../../../../components/common/KakaoMap";
import * as S from "./style";

const AboutSection = () => {
  return (
    <S.Section id="about">
      <S.Container>
        <S.SectionTitle>아쿠아리움 소개</S.SectionTitle>
        <S.IntroDesc>
          Naquarium Archive는 사라져가는 바다의 기억을 영원히 보존하는{" "}
          <span>디지털 해저 기지</span>입니다.
          <br />
          수심 3,000m 아래 숨겨진 미지의 생태계와 멸종 위기종을
          <br />
          가장 생생한 기술로 복원하여 여러분께 선보입니다.
          <br />
          <br />
          현실과 환상이 공존하는 이곳에서, 잊혀진 바다의 이야기를 들어보세요.
        </S.IntroDesc>

        <S.AboutGrid>
          <div>
            <S.SubTitle>이용 안내</S.SubTitle>
            <S.InfoBox>
              <S.InfoItem>
                <span>성인 (19세 이상)</span> <span>35,000원</span>
              </S.InfoItem>
              <S.InfoItem>
                <span>청소년 (13세~18세)</span> <span>31,000원</span>
              </S.InfoItem>
              <S.InfoItem>
                <span>운영 시간</span> <span>10:00 - 22:00</span>
              </S.InfoItem>
              <S.InfoItem $isWarning>
                <span>휴관일</span> <span>매월 첫째주 월요일</span>
              </S.InfoItem>
            </S.InfoBox>
          </div>
          <div>
            <S.SubTitle>찾아오시는 길</S.SubTitle>
            <S.MapWrapper>
              <KakaoMap />
            </S.MapWrapper>
            <S.DescArea>
              <p>📍 인천광역시 부평구 가상의 주소</p>
              <p>(주차: 지하 2층 ~ 4층 무료 이용 가능)</p>
            </S.DescArea>
          </div>
        </S.AboutGrid>
      </S.Container>
    </S.Section>
  );
};

export default AboutSection;
