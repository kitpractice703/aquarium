import * as S from "./style";

const AdmissionSection = () => {
  return (
    <S.Section>
      <S.Container>
        {/* 1. 운영 시간 카드 */}
        <S.InfoCard>
          <S.Icon>🕒</S.Icon>
          <S.Title>운영 시간</S.Title>
          <S.Desc>
            <strong>평일:</strong> 10:00 - 20:00 (입장마감 19:00)
            <br />
            <strong>주말/공휴일:</strong> 10:00 - 21:00 (입장마감 20:00)
            <br />
            <span>※ 연중무휴로 운영됩니다.</span>
          </S.Desc>
        </S.InfoCard>

        {/* 2. 이용 요금 카드 */}
        <S.InfoCard>
          <S.Icon>🎫</S.Icon>
          <S.Title>이용 요금</S.Title>
          <S.Desc>
            <strong>대인 (만 13세 이상):</strong> 35,000원
            <br />
            <strong>소인 (36개월 ~ 만 12세):</strong> 29,000원
            <br />
            <span>※ 36개월 미만 무료 입장 (증빙서류 지참)</span>
          </S.Desc>
        </S.InfoCard>
      </S.Container>
    </S.Section>
  );
};

export default AdmissionSection;
