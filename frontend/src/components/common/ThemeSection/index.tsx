import * as S from "./style";

const ThemeSection = () => {
  return (
    // 스타일 파일에 정의된 이름(SectionWrapper, InnerContainer 등)과 일치시켰습니다.
    <S.SectionWrapper id="themes">
      <S.InnerContainer>
        <S.Title>테마 전시</S.Title>

        <S.SearchBarContainer>
          <S.SearchInput
            type="text"
            placeholder="관심있는 해양 생물이나 전시관을 검색해보세요. (예: 상어, 빛의 바다)"
            onKeyPress={(e) => {
              if (e.key === "Enter") alert("검색 기능은 준비중입니다.");
            }}
          />
        </S.SearchBarContainer>

        <S.ThemeGrid>
          {/* Card 1 */}
          <S.ThemeCard>
            <S.ThemeImg
              src="https://placehold.co/400x300/003366/00f2ff?text=Light+Sea"
              alt="빛의 바다"
            />
            <S.ThemeInfo>
              <h4 style={{ color: "#ffdd57" }}>빛의 바다</h4>
              <p>
                얕은 바다의 산호초와
                <br />
                공생하는 생명들의 화려한 춤
              </p>
            </S.ThemeInfo>
          </S.ThemeCard>

          {/* Card 2 */}
          <S.ThemeCard>
            <S.ThemeImg
              src="https://placehold.co/400x300/004d40/64ffda?text=Balance+Sea"
              alt="균형의 바다"
            />
            <S.ThemeInfo>
              <h4 style={{ color: "#64ffda" }}>균형의 바다</h4>
              <p>
                먹이사슬의 정점과 저변,
                <br />
                생태계의 완벽한 조화
              </p>
            </S.ThemeInfo>
          </S.ThemeCard>

          {/* Card 3 */}
          <S.ThemeCard>
            <S.ThemeImg
              src="https://placehold.co/400x300/1a1a2e/7b1fa2?text=Deep+Sea"
              alt="깊은 바다"
            />
            <S.ThemeInfo>
              <h4 style={{ color: "#e040fb" }}>깊은 바다</h4>
              <p>
                빛이 닿지 않는 곳,
                <br />
                발광 생물들의 신비로운 기록
              </p>
            </S.ThemeInfo>
          </S.ThemeCard>

          {/* Card 4 */}
          <S.ThemeCard>
            <S.ThemeImg
              src="https://placehold.co/400x300/1b5e20/69f0ae?text=Protect+Sea"
              alt="지켜야 할 바다"
            />
            <S.ThemeInfo>
              <h4 style={{ color: "#69f0ae" }}>지켜야 할 바다</h4>
              <p>
                사라져가는 것들에 대한 기록
                <br />
                그리고 우리의 실천
              </p>
            </S.ThemeInfo>
          </S.ThemeCard>
        </S.ThemeGrid>
      </S.InnerContainer>
    </S.SectionWrapper>
  );
};

export default ThemeSection;
