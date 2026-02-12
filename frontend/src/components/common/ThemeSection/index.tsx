import * as S from "./style";
import ThemeDetailModal from "../ThemeDeatailModal";
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

      <ThemeDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialThemeId={selectedThemeId}
      />
    </>
  );
};

export default ThemeSection;
