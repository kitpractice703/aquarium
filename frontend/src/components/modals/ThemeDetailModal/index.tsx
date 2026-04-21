import { useRef } from "react";
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

  const mouseDownOnOverlay = useRef(false);

  if (!isOpen) return null;
  return (
    <S.Overlay
      onMouseDown={() => { mouseDownOnOverlay.current = true; }}
      onMouseUp={() => {
        if (mouseDownOnOverlay.current) onClose();
        mouseDownOnOverlay.current = false;
      }}
    >
      <S.Container
        onMouseDown={(e) => { e.stopPropagation(); mouseDownOnOverlay.current = false; }}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <S.CloseButton onClick={onClose}>&times;</S.CloseButton>

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

        <S.Content>
          <S.InfoArea>
            <S.Title $color={currentTheme.color}>{currentTheme.title}</S.Title>
            <S.Desc>{currentTheme.desc}</S.Desc>
          </S.InfoArea>

          {/* 테마 영상: 탭 전환 시 key로 리렌더링하여 새 영상 로드 */}
          <S.VideoArea $color={currentTheme.color}>
            <video
              key={currentTheme.id}
              src={currentTheme.video}
              autoPlay
              loop
              muted
              playsInline
              controls
            />
          </S.VideoArea>
        </S.Content>
      </S.Container>
    </S.Overlay>
  );
};

export default ThemeDetailModal;
