import { useState } from "react";
import * as S from "./style";
import ThemeDetailModal from "../ThemeDeatailModal"; // 모달 불러오기

const ThemeSection = () => {
  // [1] 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<any>(null);

  // [2] 테마 데이터 배열 (하드코딩 제거)
  const themeData = [
    {
      id: 1,
      title: "빛의 바다",
      desc: "얕은 바다의 산호초와 공생하는 생명들의 화려한 춤",
      detail:
        "태양빛이 쏟아지는 수심 10m 내외의 산호초 지대를 재현했습니다. 형형색색의 열대어와 산호가 만들어내는 빛의 향연을 만나보세요.",
      img: "https://placehold.co/400x300/003366/00f2ff?text=Light+Sea",
      color: "#ffdd57",
    },
    {
      id: 2,
      title: "균형의 바다",
      desc: "먹이사슬의 정점과 저변, 생태계의 완벽한 조화",
      detail:
        "상어와 정어리 떼가 공존하는 거대한 수조입니다. 자연계의 냉혹하지만 아름다운 균형을 파노라마 뷰로 감상할 수 있습니다.",
      img: "https://placehold.co/400x300/004d40/64ffda?text=Balance+Sea",
      color: "#64ffda",
    },
    {
      id: 3,
      title: "깊은 바다",
      desc: "빛이 닿지 않는 곳, 발광 생물들의 신비로운 기록",
      detail:
        "수심 3,000m 심해를 탐험합니다. 자체 발광하는 해파리와 심해 아귀 등, 지구상에서 가장 미스터리한 생명체들을 만날 수 있습니다.",
      img: "https://placehold.co/400x300/1a1a2e/7b1fa2?text=Deep+Sea",
      color: "#e040fb",
    },
    {
      id: 4,
      title: "지켜야 할 바다",
      desc: "사라져가는 것들에 대한 기록 그리고 우리의 실천",
      detail:
        "해양 오염으로 고통받는 바다거북과 산호 백화 현상을 디지털 아트로 표현했습니다. 우리가 바다를 위해 무엇을 할 수 있는지 고민해보는 공간입니다.",
      img: "https://placehold.co/400x300/1b5e20/69f0ae?text=Protect+Sea",
      color: "#69f0ae",
    },
  ];

  // [3] 클릭 핸들러
  const handleCardClick = (theme: any) => {
    setSelectedTheme(theme);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
            {/* 데이터 배열을 순회하며 카드 생성 */}
            {themeData.map((theme) => (
              <S.ThemeCard
                key={theme.id}
                onClick={() => handleCardClick(theme)}
              >
                <S.ThemeImg src={theme.img} alt={theme.title} />
                <S.ThemeInfo>
                  <h4 style={{ color: theme.color }}>{theme.title}</h4>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: theme.desc.replace(",", "<br/>"),
                    }}
                  />
                </S.ThemeInfo>
              </S.ThemeCard>
            ))}
          </S.ThemeGrid>
        </S.InnerContainer>
      </S.SectionWrapper>

      {/* 모달 컴포넌트 삽입 */}
      <ThemeDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedTheme}
      />
    </>
  );
};

export default ThemeSection;
