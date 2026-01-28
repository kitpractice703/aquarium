import { useEffect, useRef } from "react";
import * as S from "./style";

const KakaoMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-ignore
    if (window.kakao && window.kakao.maps) {
      // @ts-ignore
      window.kakao.maps.load(() => {
        if (!containerRef.current) return;

        const options = {
          // @ts-ignore
          center: new window.kakao.maps.LatLng(37.4895, 126.7231), // 부평역
          level: 3,
        };
        // @ts-ignore
        const map = new window.kakao.maps.Map(containerRef.current, options);
        // @ts-ignore
        const markerPosition = new window.kakao.maps.LatLng(37.4895, 126.7231);
        // @ts-ignore
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
