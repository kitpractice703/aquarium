import * as S from "./style";

const HeroSection = () => {
  return (
    <S.Hero>
      <S.VideoBg autoPlay loop muted playsInline>
        <source
          src="https://videos.pexels.com/video-files/854959/854959-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
      </S.VideoBg>

      <S.Content>
        <S.Title>
          보이지 않던 바다,
          <br />그 너머의 기록
        </S.Title>
        <S.Desc>
          현실과 허구의 경계, 심해 3,000m의 아쿠아리움에 오신 것을 환영합니다.
        </S.Desc>
        <S.BtnMain
          onClick={() =>
            document
              .getElementById("booking")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          관람 예매하기
        </S.BtnMain>
      </S.Content>
    </S.Hero>
  );
};

export default HeroSection;
