/**
 * 카카오맵 컴포넌트
 * - useKakaoMap 훅으로 지도 초기화 및 마커 표시
 * - AboutSection 내부에서 사용 (아쿠아리움 위치 표시)
 */
import { useKakaoMap } from "./hooks/useKakaoMap";
import * as S from "./style";

const KakaoMap = () => {
  const { containerRef } = useKakaoMap();
  return <S.MapContainer ref={containerRef} id="map" />;
};

export default KakaoMap;
