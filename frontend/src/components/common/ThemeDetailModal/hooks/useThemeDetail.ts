/**
 * 테마 상세 모달 로직 커스텀 훅
 * - 4개 테마의 영상 + 설명 데이터 관리
 * - 모달 열림 시 초기 테마 설정 + body 스크롤 잠금
 * - 탭 전환으로 현재 활성 테마 변경
 */
import { useState, useEffect } from "react";

import lightSeaVideo from "../../../../assets/videos/light_sea.mp4";
import balanceSeaVideo from "../../../../assets/videos/balance_sea.mp4";
import deepSeaVideo from "../../../../assets/videos/deep_sea.mp4";
import protectSeaVideo from "../../../../assets/videos/protect_sea.mp4";

export const useThemeDetail = (isOpen: boolean, initialThemeId: number) => {
  /** 테마 데이터: 각 테마별 색상, 영상, 상세 설명 */
  const THEMES = [
    {
      id: 0,
      title: "빛의 바다",
      color: "#ffdd57",
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
      video: protectSeaVideo,
      desc: `우리가 무심코 버린 것들에 뒤덮여, 점점 사라져 가는 푸른 불꽃.\n이제 우리는 위기의 바다가 마지막으로 내민 손을 보고 있습니다.\n당신은 어떤 선택을 하시겠습니까?`,
    },
  ];

  const [activeTabId, setActiveTabId] = useState<number>(initialThemeId);

  /** 모달 열림 시 초기 테마 설정 + 스크롤 잠금 */
  useEffect(() => {
    if (isOpen) {
      setActiveTabId(initialThemeId);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, initialThemeId]);

  /** 현재 활성 테마 (없으면 첫 번째 테마 폴백) */
  const currentTheme = THEMES.find((t) => t.id === activeTabId) || THEMES[0];

  return {
    THEMES,
    activeTabId,
    setActiveTabId,
    currentTheme,
  };
};
