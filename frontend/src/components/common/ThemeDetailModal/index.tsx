/**
 * 테마 상세 모달 컴포넌트
 * - 4개 테마 탭 전환 (각 테마 고유 색상 하이라이트)
 * - 선택된 테마의 영상 + 상세 설명 표시
 * - 영상: autoPlay, loop, muted로 자동 재생
 */
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

        {/* 테마 탭: 선택 시 해당 테마 색상으로 하단 보더 표시 */}
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
          {/* 테마 설명 영역 */}
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
