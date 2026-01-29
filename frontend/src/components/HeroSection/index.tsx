import * as S from "./style";
// [FIX] 비디오 파일 경로가 정확한지 확인해주세요. 없다면 검은 화면이 나옵니다.
// 만약 로컬 파일이 없다면 테스트용 URL을 사용하세요.
import mainVideo from "../../assets/videos/main_video.mp4";

// [ADDED] 부모 컴포넌트(Home)로부터 받을 함수 타입을 정의합니다.
interface Props {
  onBookClick: () => void;
}

const HeroSection = ({ onBookClick }: Props) => {
  return (
    <S.Hero>
      {/* 영상이 없다면 배경색이 보이도록 스타일에서 background-color 설정 필요 */}
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

        {/* [MODIFIED] 버튼 클릭 시 onBookClick 실행 */}
        <S.BtnMain onClick={onBookClick}>관람 예매하기</S.BtnMain>
      </S.Content>
    </S.Hero>
  );
};

export default HeroSection;
