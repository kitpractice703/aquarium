import { useState, useEffect } from "react";
import * as S from "./style";

// 테마 데이터 (모달 내부에서 탭 이동할 때 씀)
const THEMES = [
  {
    id: 0,
    title: "빛의 바다",
    color: "#ffdd57",
    image: "/images/theme_light.jpg", // ⚠️ public/images/theme_light.jpg 파일 필요
    desc: `햇빛이 수면 위에서 부서지며 만들어내는 찬란한 빛의 파동.\n그 파동 아래에서 형형색색의 생명들이 태어나고, 바다를 아름답게 꾸며 줍니다.\n찬란한 바다의 한 가운데, 빛의 바다로 여러분을 초대합니다.`,
  },
  {
    id: 1,
    title: "균형의 바다",
    color: "#64ffda",
    image: "/images/theme_balance.jpg", // ⚠️ public/images/theme_balance.jpg 파일 필요
    desc: `오늘도 조용히 포식과 도피가 반복되는 냉혹한 바다의 세계.\n죽음이 또다른 탄생의 신호가 되고, 생존본능은 바다의 규칙을 만들어냅니다.\n이 잔혹한 규칙 속에서 오늘도 바다의 질서는 유지 됩니다.`,
  },
  {
    id: 2,
    title: "깊은 바다",
    color: "#e040fb",
    image: "https://placehold.co/800x450/1a1a2e/FFF?text=Deep+Sea",
    desc: `햇빛마저 어둠을 이기지 못해 물러난 바다의 새벽.\n빛보다 어둠을 택한 존재들의 아름다움은 오직 심연을 들여다 본 이에게만 허락됩니다.\n빛이 아닌 어둠으로 밝혀지는 그곳, 침묵의 이야기를 들려드립니다.`,
  },
  {
    id: 3,
    title: "지켜야 할 바다",
    color: "#69f0ae",
    image: "https://placehold.co/800x450/1b5e20/FFF?text=Protect+Sea",
    desc: `우리가 무심코 버린 것들에 뒤덮여, 점점 사라져 가는 푸른 불꽃.\n이제 우리는 위기의 바다가 마지막으로 내민 손을 보고 있습니다.\n당신은 어떤 선택을 하시겠습니까?`,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialThemeId: number;
}

const ThemeDetailModal = ({ isOpen, onClose, initialThemeId }: Props) => {
  const [activeTabId, setActiveTabId] = useState<number>(initialThemeId);

  useEffect(() => {
    if (isOpen) {
      setActiveTabId(initialThemeId);
      document.body.style.overflow = "hidden"; // 스크롤 막기
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, initialThemeId]);

  if (!isOpen) return null;

  const currentTheme = THEMES[activeTabId];
  if (!currentTheme) return null;

  return (
    <S.Overlay onClick={onClose}>
      <S.Container onClick={(e) => e.stopPropagation()}>
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

          <S.VideoArea $color={currentTheme.color}>
            <img
              src={currentTheme.image}
              alt={currentTheme.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.8,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "60px",
                color: "#fff",
              }}
            >
              ▶
            </div>
          </S.VideoArea>
        </S.Content>
      </S.Container>
    </S.Overlay>
  );
};

export default ThemeDetailModal;
