/**
 * 히어로 섹션 컴포넌트 (메인 비주얼)
 * - 전체 화면 배경 영상 + 타이틀/설명 + 예매 CTA 버튼
 * - 영상: assets/videos/main_video.mp4 (자동 재생, 루프)
 * - 우측 하단 볼륨 컨트롤: on/off 토글 + 슬라이더
 */
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

  /** 음소거 토글: 음소거 해제 시 현재 볼륨 적용 */
  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      if (!newMuted) {
        videoRef.current.volume = volume;
      }
      setIsMuted(newMuted);
    }
  };

  /** 볼륨 슬라이더 변경 */
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      // 볼륨 0이면 자동 음소거
      if (newVolume === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  /** 볼륨 아이콘: 음소거 / 저음량 / 고음량 구분 */
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return "🔇";
    if (volume < 0.5) return "🔉";
    return "🔊";
  };

  return (
    <S.Hero>
      {/* 배경 영상: 자동 재생, 음소거(기본), 반복 */}
      <S.VideoBg
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        src={mainVideo}
      />
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

      {/* 우측 하단 볼륨 컨트롤 */}
      <S.VolumeControl
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        {/* 볼륨 슬라이더 (호버 시 표시) */}
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
        {/* 음소거/해제 토글 버튼 */}
        <S.VolumeBtn onClick={toggleMute}>{getVolumeIcon()}</S.VolumeBtn>
      </S.VolumeControl>
    </S.Hero>
  );
};

export default HeroSection;
