import * as S from "./style";
import mainVideo from "../../assets/videos/main_video.mp4";

interface Props {
  onBookClick: () => void;
}

const HeroSection = ({ onBookClick }: Props) => {
  return (
    <S.Hero>
      <S.VideoBg autoPlay loop muted playsInline src={mainVideo} />
      <S.Content>
        <S.Title>
          보이지 않던 바다,
          <br />그 너머의 기록
        </S.Title>
        <S.Desc>
          빛, 균형, 깊이, 그리고 공존...
          <br />
          신비로운 테마로 펼쳐지는 심해 탐험에 여러분을 초대합니다.
        </S.Desc>

        <S.BtnMain onClick={onBookClick}>관람 예매하기</S.BtnMain>
      </S.Content>
    </S.Hero>
  );
};

export default HeroSection;
