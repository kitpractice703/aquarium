/** 카카오맵 컨테이너 스타일 */
import styled from "styled-components";

/** 지도 컨테이너: 500px 높이, 둥근 모서리 + 그림자 */
export const MapContainer = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;
