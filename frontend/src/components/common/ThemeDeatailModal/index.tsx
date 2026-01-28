import { useState, useEffect } from "react";
import * as S from "./style";
import lightSeaVideo from "../../../assets/videos/light_sea.mp4";
import balanceSeaVideo from "../../../assets/videos/balance_sea.mp4";
import deepSeaVideo from "../../../assets/videos/deep_sea.mp4";
import prodectSeaVideo from "../../../assets/videos/protect_sea.mp4";

// 테마 데이터 (비디오 URL 추가됨)
const THEMES = [
  {
    id: 0,
    title: "빛의 바다",
    color: "#ffdd57",
    // 실제 파일이 없다면 아래 URL들이 샘플 영상으로 나옵니다.
    video: lightSeaVideo,
    desc: `햇빛이 수면 위에서 부서지며 만들어내는 찬란한 빛의 파동.\n그 파동 아래에서 형형색색의 생명들이 태어나고, 바다를 아름답게 꾸며 줍니다.\n찬란한 바다의 한 가운데, 빛의 바다로 여러분을 초대합니다.`,
  },
  {
    id: 1,
    title: "균형의 바다",
    color: "#64ffda",
    video: balanceSeaVideo,
    desc: `오늘도 조용히 포식과 도피가 반복되는 냉혹한 바다의 세계.\n죽음이 또다른 탄생의 신호가 되고, 생존본능은 바다의 규칙을 만들어냅니다.\n이 잔혹한 규칙 속에서 오늘도 바다의 질서는 유지 됩니다.`,
  },
  {
    id: 2,
    title: "깊은 바다",
    color: "#e040fb",
    video: deepSeaVideo,
    desc: `햇빛마저 어둠을 이기지 못해 물러난 바다의 새벽.\n빛보다 어둠을 택한 존재들의 아름다움은 오직 심연을 들여다 본 이에게만 허락됩니다.\n빛이 아닌 어둠으로 밝혀지는 그곳, 침묵의 이야기를 들려드립니다.`,
  },
  {
    id: 3,
    title: "지켜야 할 바다",
    color: "#69f0ae",
    video: prodectSeaVideo,
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
      document.body.style.overflow = "hidden"; // 모달 켜지면 배경 스크롤 막기
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, initialThemeId]);

  if (!isOpen) return null;

  const currentTheme = THEMES.find((t) => t.id === activeTabId) || THEMES[0];

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
