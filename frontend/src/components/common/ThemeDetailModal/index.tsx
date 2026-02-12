import * as S from "./style";
import { useThemeDetail } from "./hooks/useThemeDetail";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialThemeId: number;
}

const ThemeDetailModal = ({ isOpen, onClose, initialThemeId }: Props) => {
  const { THEMES, activeTabId, setActiveTabId, currentTheme } = useThemeDetail(
    isOpen,
    initialThemeId,
  );

  if (!isOpen) return null;
  return (
    <S.Overlay onClick={onClose}>
      <S.Container onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose}>&times;</S.CloseButton>

        {/* 상단 탭 */}
        <S.Tabs>
          {THEMES.map((theme) => (
            <S.TabItem
              key={theme.id}
              $active={activeTabId === theme.id}
              $color={theme.color}
              onClick={() => setActiveTabId(theme.id)}
            >
              {theme.title}
            </S.TabItem>
          ))}
        </S.Tabs>

        {/* 본문 내용 */}
        <S.Content>
          <S.InfoArea>
            <S.Title $color={currentTheme.color}>{currentTheme.title}</S.Title>
            <S.Desc>{currentTheme.desc}</S.Desc>
          </S.InfoArea>

          {/* 비디오 영역 */}
          <S.VideoArea $color={currentTheme.color}>
            <video
              key={currentTheme.id} // 키가 바뀌어야 영상이 새로 로드됨
              src={currentTheme.video}
              autoPlay
              loop
              muted
              playsInline
              controls // 사용자가 조작 가능하도록 추가
            />
          </S.VideoArea>
        </S.Content>
      </S.Container>
    </S.Overlay>
  );
};

export default ThemeDetailModal;
