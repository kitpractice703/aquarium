import styled from "styled-components";

// [ADDED] 반응형 브레이크포인트나 컬러가 전역으로 없다면 깨질 수 있어, 여기서 fallback(기본값)을 고려한 코드로 작성했습니다.
// 만약 var(--bg-dark) 등이 정의되지 않았다면, 콤마 뒤의 색상이 적용됩니다.

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: 80px;
  /* [MODIFIED] CSS 변수가 없을 경우를 대비해 기본 다크 색상(#121212)을 백업으로 지정했습니다. */
  background-color: var(--bg-dark, #121212);
`;

export const Banner = styled.div`
  width: 100%;
  height: 300px;
  /* [MODIFIED] 이미지 경로가 실제 존재하는지 확인해주세요. 없다면 검은 배경만 보입니다. */
  background:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("/images/theme_light.jpg") no-repeat center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: 48px;
  color: #fff;
  text-shadow: 0 0 20px rgba(0, 242, 255, 0.5);
`;

export const Content = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 50px auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  /* [MODIFIED] 변수 미적용 시 기본값 추가 */
  background: var(--bg-card, #1e1e1e);
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0, 242, 255, 0.15);
    /* [MODIFIED] 변수 미적용 시 Cyan 색상 기본값 */
    border-color: var(--accent-cyan, #00f2ff);
  }
`;

export const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #000;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CardBody = styled.div`
  padding: 20px;
`;

export const CardTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  color: #fff;
`;

export const CardDesc = styled.p`
  font-size: 14px;
  /* [MODIFIED] 변수 미적용 시 회색 기본값 */
  color: var(--text-gray, #a0a0a0);
  line-height: 1.6;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
