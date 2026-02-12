import { useState } from "react";
import lightSeaImg from "../../../../assets/images/light_sea.jpg";
import balanceSeaImg from "../../../../assets/images/balance_sea.jpg";
import deepSeaImg from "../../../../assets/images/deep_sea.jpg";
import protectSeaImg from "../../../../assets/images/protect_sea.jpg";
import type { ThemeItem } from "../../../../types/api";

export const useThemeSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<number>(0);

  const themeData: ThemeItem[] = [
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
      id: 3,
      title: "지켜야 할 바다",
      desc: "사라져가는 것들에 대한 기록 그리고 우리의 실천",
      img: protectSeaImg,
      color: "#69f0ae",
    },
  ];

  const handleCardClick = (id: number) => {
    setSelectedThemeId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return {
    themeData,
    handleCardClick,
    closeModal,
    isModalOpen,
    selectedThemeId,
  };
};

export default useThemeSection;
