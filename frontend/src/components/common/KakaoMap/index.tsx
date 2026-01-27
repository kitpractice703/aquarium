import { useEffect, useRef } from "react";
import * as S from "./style";

const KakaoMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // window.kakao가 있는지 확인 (index.html에 스크립트가 있어야 함)
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        if (!containerRef.current) return;

        const options = {
          center: new window.kakao.maps.LatLng(37.4915, 126.724), // 부평역
          level: 3,
        };

        const map = new window.kakao.maps.Map(containerRef.current, options);

        const markerPosition = new window.kakao.maps.LatLng(37.4915, 126.724);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    }
  }, []);

  return <S.MapContainer ref={containerRef} id="map" />;
};

export default KakaoMap;
