/** 카카오맵 컴포넌트 - AboutSection 내 아쿠아리움 위치 표시 */
import { useKakaoMap } from "./hooks/useKakaoMap";
import * as S from "./style";

const KakaoMap = () => {
  const { containerRef } = useKakaoMap();
  return <S.MapContainer ref={containerRef} id="map" />;
};

export default KakaoMap;
