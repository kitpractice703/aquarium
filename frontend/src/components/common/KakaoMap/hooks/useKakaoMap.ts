/** 카카오 지도 초기화 커스텀 훅 - 지정 좌표에 마커 표시 */
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export const useKakaoMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao Map script is not loaded");
      return;
    }

    window.kakao.maps.load(() => {
      if (!containerRef.current) return;

      const centerPosition = new window.kakao.maps.LatLng(37.4895, 126.7231);

      const options = {
        center: centerPosition,
        level: 3,
      };

      const map = new window.kakao.maps.Map(containerRef.current, options);

      const marker = new window.kakao.maps.Marker({
        position: centerPosition,
      });

      marker.setMap(map);
    });
  }, []);

  return {
    containerRef,
  };
};
