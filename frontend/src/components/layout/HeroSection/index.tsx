import { useState, useRef } from "react";
import * as S from "./style";
import mainVideo from "../../../assets/videos/main_video.mp4";

interface Props {
  onBookClick: () => void;
}

const HeroSection = ({ onBookClick }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showSlider, setShowSlider] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      if (!newMuted) videoRef.current.volume = volume;
      setIsMuted(newMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      // 볼륨 0으로 내리면 자동 음소거, 음소거 상태에서 볼륨 올리면 자동 해제
      if (newVolume === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return "🔇";
    if (volume < 0.5) return "🔉";
    return "🔊";
  };

  return (
    <S.Hero>
      <S.VideoBg ref={videoRef} autoPlay loop muted playsInline src={mainVideo} />
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

      <S.VolumeControl
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        {showSlider && (
          <S.VolumeSliderWrapper>
            <S.VolumeSlider
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
            />
          </S.VolumeSliderWrapper>
        )}
        <S.VolumeBtn onClick={toggleMute}>{getVolumeIcon()}</S.VolumeBtn>
      </S.VolumeControl>
    </S.Hero>
  );
};

export default HeroSection;
