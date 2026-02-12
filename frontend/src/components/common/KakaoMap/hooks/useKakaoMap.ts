import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export const useKakaoMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. 카카오 스크립트가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao Map script is not loaded");
      return;
    }

    // 2. 맵 로드 시작
    window.kakao.maps.load(() => {
      if (!containerRef.current) return;

      // [Tip] 좌표 같은 건 상수로 빼두면 관리가 편합니다. (부평역)
      const centerPosition = new window.kakao.maps.LatLng(37.4895, 126.7231);

      const options = {
        center: centerPosition,
        level: 3,
      };

      // 지도 생성
      const map = new window.kakao.maps.Map(containerRef.current, options);

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: centerPosition, // 위에서 만든 좌표 재사용
      });

      // 지도에 마커 올리기
      marker.setMap(map);
    });
  }, []);

  return {
    containerRef,
  };
};
