import Header from "../../components/Header";
import Footer from "../../components/Footer";
import * as S from "./style";

const programs = [
  {
    id: 1,
    title: "상어 생태 설명회",
    desc: "바다의 제왕 상어의 숨겨진 비밀을 사육사에게 직접 들어보는 시간입니다.",
    img: "/images/theme_balance.jpg",
  },
  {
    id: 2,
    title: "펭귄 먹이주기",
    desc: "뒤뚱뒤뚱 귀여운 펭귄들의 식사 시간을 눈앞에서 관찰해보세요.",
    img: "https://placehold.co/600x400/1a1a2e/FFF?text=Penguin",
  },
  {
    id: 3,
    title: "수중 뮤지컬",
    desc: "거대 수조 안에서 펼쳐지는 인어공주와 바다 친구들의 아름다운 공연.",
    img: "https://placehold.co/600x400/1a1a2e/FFF?text=Musical",
  },
];

const Program = () => {
  return (
    <>
      <Header />
      <S.Container>
        <S.Banner>
          <S.Title>PROGRAM</S.Title>
        </S.Banner>
        <S.Content>
          {programs.map((item) => (
            <S.Card key={item.id}>
              <S.CardImage>
                <img src={item.img} alt={item.title} />
              </S.CardImage>
              <S.CardBody>
                <S.CardTitle>{item.title}</S.CardTitle>
                <S.CardDesc>{item.desc}</S.CardDesc>
              </S.CardBody>
            </S.Card>
          ))}
        </S.Content>
      </S.Container>
      <Footer />
    </>
  );
};

export default Program;
