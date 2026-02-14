/**
 * 테마 전시 섹션 컴포넌트
 * - 4개 테마 카드 그리드: 빛의 바다, 균형의 바다, 깊은 바다, 지켜야 할 바다
 * - 카드 클릭 시 ThemeDetailModal 열림 (영상 + 상세 설명)
 */
import * as S from "./style";
import ThemeDetailModal from "../../modals/ThemeDetailModal";
import { useThemeSection } from "./hooks/useThemeSection";

const ThemeSection = () => {
  const {
    themeData,
    handleCardClick,
    closeModal,
    isModalOpen,
    selectedThemeId,
  } = useThemeSection();

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

      {/* 테마 상세 모달 */}
      <ThemeDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialThemeId={selectedThemeId}
      />
    </>
  );
};

export default ThemeSection;
