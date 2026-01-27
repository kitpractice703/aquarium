import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import type { Exhibition } from "../../../../types/api"; // 아까 만든 타입

const Section = styled.section`
  padding: var(--padding-section);
`;
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;
const Title = styled.h2`
  font-size: 36px;
  text-align: center;
  margin-bottom: 60px;
  color: var(--accent-cyan);
`;
const SearchBar = styled.input`
  width: 50%;
  padding: 15px;
  border-radius: 30px;
  border: 1px solid var(--accent-cyan);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 16px;
  display: block;
  margin: 0 auto 50px;
  &:focus {
    outline: none;
    box-shadow: 0 0 10px var(--accent-cyan);
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;
const Card = styled.div`
  background: var(--bg-card);
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  }
`;

const ThemeSection = () => {
  const [themes, setThemes] = useState<Exhibition[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/exhibitions")
      .then((res) => setThemes(res.data))
      .catch(() => {
        // 더미 데이터 (보내주신 HTML 내용 반영)
        setThemes([
          {
            exhibitionId: 1,
            title: "빛의 바다",
            subTitle: "",
            description: "얕은 바다의 산호초",
            imageUrl: "/images/theme_light.jpg",
            themeColor: "#ffdd57",
          },
          {
            exhibitionId: 2,
            title: "균형의 바다",
            subTitle: "",
            description: "먹이사슬의 정점과 저변",
            imageUrl: "/images/theme_balance.jpg",
            themeColor: "#64ffda",
          },
          {
            exhibitionId: 3,
            title: "깊은 바다",
            subTitle: "",
            description: "빛이 닿지 않는 곳",
            imageUrl:
              "https://placehold.co/400x300/1a1a2e/7b1fa2?text=Deep+Sea",
            themeColor: "#e040fb",
          },
          {
            exhibitionId: 4,
            title: "지켜야 할 바다",
            subTitle: "",
            description: "사라져가는 것들에 대한 기록",
            imageUrl:
              "https://placehold.co/400x300/1b5e20/69f0ae?text=Protect+Sea",
            themeColor: "#69f0ae",
          },
        ]);
      });
  }, []);

  return (
    <Section id="themes">
      <Container>
        <Title>테마 전시</Title>
        <SearchBar placeholder="관심있는 해양 생물이나 전시관을 검색해보세요." />
        <Grid>
          {themes.map((t) => (
            <Card key={t.exhibitionId}>
              <img
                src={t.imageUrl}
                style={{ width: "100%", height: "250px", objectFit: "cover" }}
                alt={t.title}
              />
              <div style={{ padding: "20px", textAlign: "center" }}>
                <h4
                  style={{
                    color: t.themeColor,
                    fontSize: "20px",
                    marginBottom: "10px",
                  }}
                >
                  {t.title}
                </h4>
                <p style={{ color: "var(--text-gray)", fontSize: "14px" }}>
                  {t.description}
                </p>
              </div>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};
export default ThemeSection;
