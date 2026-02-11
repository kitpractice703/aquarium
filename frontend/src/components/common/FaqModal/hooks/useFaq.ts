import { useState, useEffect } from "react";
import type { FaqData } from "../../../../types/api";

// [데이터] 기존 index.tsx에 있던 데이터를 여기로 옮기고, id를 추가했습니다.
const FAQ_LIST: FaqData[] = [
  {
    id: 1,
    category: "예매/환불",
    question: "예매 취소는 언제까지 가능한가요?",
    answer:
      "관람일 전일 23:59까지 100% 환불 가능합니다. 당일 취소는 불가능하며, 천재지변으로 인한 시설 폐쇄 시에는 전액 환불해 드립니다.",
  },
  {
    id: 2,
    category: "시설이용",
    question: "주차장 이용 안내",
    answer:
      "아쿠아리움 이용객은 지하 2층부터 4층 주차장을 최대 4시간까지 무료로 이용하실 수 있습니다. 이후 10분당 500원의 요금이 부과됩니다.",
  },
  {
    id: 3,
    category: "시설이용",
    question: "유모차 및 휠체어 대여가 가능한가요?",
    answer:
      "네, 1층 안내데스크에서 신분증을 맡기시면 무료로 대여 가능합니다. (유모차 50대, 휠체어 20대 보유, 선착순 마감)",
  },
  {
    id: 4,
    category: "관람",
    question: "음식물 반입이 되나요?",
    answer:
      "쾌적한 관람 환경과 해양 생물의 안전을 위해 생수를 제외한 모든 음식물 반입은 제한됩니다. 내부 카페테리아를 이용해 주세요.",
  },
  {
    id: 5,
    category: "할인",
    question: "제휴 카드 할인이 있나요?",
    answer:
      "현재 삼성카드, 현대카드 소지자는 본인 및 동반 1인까지 30% 할인이 적용됩니다. 통신사 멤버십 할인은 준비 중입니다.",
  },
  {
    id: 6,
    category: "관람",
    question: "재입장이 가능한가요?",
    answer:
      "퇴장 후 재입장은 원칙적으로 불가능합니다. 단, 긴급 상황이나 특별한 사유가 있는 경우 출구 직원에게 문의해 주세요.",
  },
  {
    id: 7,
    category: "기타",
    question: "분실물을 습득하거나 잃어버렸어요.",
    answer:
      "분실물 센터는 1층 안내데스크 옆에 위치하고 있습니다. 습득물은 1개월간 보관 후 경찰서로 이관됩니다.",
  },
];

export const useFaq = (isOpen: boolean) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 스크롤 잠금/해제 및 초기화 로직
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setOpenIndex(null); // 모달 열릴 때마다 닫힌 상태로 시작
    } else {
      document.body.style.overflow = "auto";
    }

    // cleanup
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return { faqList: FAQ_LIST, openIndex, handleToggle };
};
