import { useState } from "react";
import * as S from "./style";
import ThemeDetailModal from "../ThemeDeatailModal";
import lightSeaImg from "../../../assets/images/light_sea.jpg";
import balanceSeaImg from "../../../assets/images/balance_sea.jpg";
import deepSeaImg from "../../../assets/images/deep_sea.jpg";
import protectSeaImg from "../../../assets/images/protect_sea.jpg";

const ThemeSection = () => {
  // [1] 모달 상태 관리 (이제 ID만 기억합니다)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<number>(0);

  // [2] 테마 카드 데이터 (모달 내부 데이터와 ID를 0부터 맞춰줍니다)
  const themeData = [
    {
      id: 0, // 모달의 0번(빛의 바다)과 연결
      title: "빛의 바다",
      desc: "얕은 바다의 산호초와 공생하는 생명들의 화려한 춤",
      img: lightSeaImg,
      color: "#ffdd57",
    },
    {
      id: 1, // 모달의 1번(균형의 바다)과 연결
      title: "균형의 바다",
      desc: "먹이사슬의 정점과 저변, 생태계의 완벽한 조화",
      img: balanceSeaImg,
      color: "#64ffda",
    },
    {
      id: 2, // 모달의 2번(깊은 바다)과 연결
      title: "깊은 바다",
      desc: "빛이 닿지 않는 곳, 발광 생물들의 신비로운 기록",
      img: deepSeaImg,
      color: "#e040fb",
    },
    {
      id: 3, // 모달의 3번(지켜야 할 바다)과 연결
      title: "지켜야 할 바다",
      desc: "사라져가는 것들에 대한 기록 그리고 우리의 실천",
      img: protectSeaImg,
      color: "#69f0ae",
    },
  ];

  // [3] 클릭 핸들러 (ID를 받아서 저장)
  const handleCardClick = (id: number) => {
    setSelectedThemeId(id);
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

          <S.ThemeGrid>
            {themeData.map((theme) => (
              <S.ThemeCard
                key={theme.id}
                onClick={() => handleCardClick(theme.id)}
              >
                <S.ThemeImg src={theme.img} alt={theme.title} />
                <S.ThemeInfo>
                  <h4 style={{ color: theme.color }}>{theme.title}</h4>
                  {/* 설명 텍스트의 콤마를 줄바꿈으로 변경 */}
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

      {/* [수정 포인트] data={...} 대신 initialThemeId={...} 를 전달합니다 */}
      <ThemeDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialThemeId={selectedThemeId}
      />
    </>
  );
};

export default ThemeSection;
