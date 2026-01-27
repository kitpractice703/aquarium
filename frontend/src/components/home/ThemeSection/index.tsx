import { useState, useEffect } from "react";
import axios from "axios";
import * as S from "./style";
import ThemeDetailModal from "../ThemeDeatailModal"; // 방금 만든 모달 불러오기

// 백엔드에서 받아올 데이터 타입
interface Exhibition {
  id: number;
  title: string;
  subTitle: string;
  imageUrl: string;
  themeColor: string;
}

const ThemeSection = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState(0);

  useEffect(() => {
    // 1. 백엔드 API 요청 시도
    axios
      .get<Exhibition[]>("http://localhost:8080/api/exhibitions")
      .then((res) => setExhibitions(res.data))
      .catch((err) => {
        console.error("API 연결 실패 (더미 데이터 사용):", err);
        // 2. 실패 시 임시(Dummy) 데이터 사용
        setExhibitions([
          {
            id: 1,
            title: "빛의 바다",
            subTitle: "Light Sea",
            imageUrl: "/images/theme_light.jpg",
            themeColor: "#ffdd57",
          },
          {
            id: 2,
            title: "균형의 바다",
            subTitle: "Balance Sea",
            imageUrl: "/images/theme_balance.jpg",
            themeColor: "#64ffda",
          },
          {
            id: 3,
            title: "깊은 바다",
            subTitle: "Deep Sea",
            imageUrl: "https://placehold.co/600x400/1a1a2e/FFF?text=Deep+Sea",
            themeColor: "#e040fb",
          },
          {
            id: 4,
            title: "지켜야 할 바다",
            subTitle: "Protect Sea",
            imageUrl:
              "https://placehold.co/600x400/1b5e20/FFF?text=Protect+Sea",
            themeColor: "#69f0ae",
          },
        ]);
      });
  }, []);

  const handleCardClick = (index: number) => {
    setSelectedThemeId(index); // 0, 1, 2, 3 인덱스 전달
    setIsModalOpen(true);
  };

  return (
    <>
      <S.Section>
        <S.Container>
          <S.SectionTitle>테마 전시</S.SectionTitle>
          <S.Grid>
            {exhibitions.map((item, index) => (
              <S.ThemeCard key={item.id} onClick={() => handleCardClick(index)}>
                <S.CardImage src={item.imageUrl} alt={item.title} />
                <S.CardInfo>
                  <S.ThemeTitle $color={item.themeColor}>
                    {item.title}
                  </S.ThemeTitle>
                  <S.ThemeSubtitle>{item.subTitle}</S.ThemeSubtitle>
                </S.CardInfo>
              </S.ThemeCard>
            ))}
          </S.Grid>
        </S.Container>
      </S.Section>

      {/* 모달 컴포넌트 */}
      <ThemeDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialThemeId={selectedThemeId}
      />
    </>
  );
};

export default ThemeSection;
