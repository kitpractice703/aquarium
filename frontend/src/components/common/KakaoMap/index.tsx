import { useKakaoMap } from "./hooks/useKakaoMap";
import * as S from "./style";

const KakaoMap = () => {
  const { containerRef } = useKakaoMap();
  return <S.MapContainer ref={containerRef} id="map" />;
};

export default KakaoMap;
