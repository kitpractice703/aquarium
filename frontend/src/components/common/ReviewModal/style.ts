import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const Container = styled.div`
  background: var(--bg-card);
  width: 90%;
  max-width: 1000px;
  height: 85vh;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 50px rgba(0, 242, 255, 0.15);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

export const Header = styled.div`
  padding: 25px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    color: #fff;
    font-size: 24px;
    span {
      color: var(--accent-cyan);
      font-size: 16px;
      margin-left: 10px;
    }
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 28px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    color: #fff;
    transform: rotate(90deg);
  }
`;

export const Content = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }
`;

/* [1] 목록 (List) 스타일 */
export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 100px 120px;
  padding: 15px 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  color: var(--text-gray);
  font-weight: bold;
  text-align: center;

  .title-col {
    text-align: left;
    padding-left: 10px;
  }
`;

export const ReviewItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 100px 120px;
  padding: 20px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .title {
    text-align: left;
    padding-left: 10px;
    color: #fff;
    font-size: 16px;
  }
  .rating {
    color: #ffdd57;
  }
  .author {
    color: var(--text-gray);
    font-size: 14px;
  }
  .date {
    color: #666;
    font-size: 13px;
  }
`;

/* [수정됨] 페이지네이션 중앙 정렬 강화 */
export const Pagination = styled.div`
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  gap: 10px;
  margin-top: auto; /* 내용을 밀고 바닥에 위치 */
  padding-top: 30px;
  width: 100%; /* 부모 영역 전체 사용 */

  button {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #888;
    width: 35px;
    height: 35px;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;

    /* 버튼 내부 텍스트도 중앙 정렬 */
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      border-color: var(--accent-cyan);
      color: #fff;
    }
    &.active {
      background: var(--accent-cyan);
      color: #000;
      border-color: var(--accent-cyan);
      font-weight: bold;
    }
    &:disabled {
      opacity: 0.3;
      cursor: default;
    }
  }
`;

export const WriteBtn = styled.button`
  position: absolute;
  bottom: 30px;
  right: 30px;
  background: var(--accent-cyan);
  color: #000;
  padding: 12px 25px;
  border: none;
  border-radius: 30px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  transition: 0.3s;
  z-index: 10; /* 페이지네이션 위에 뜨도록 설정 */

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 242, 255, 0.3);
  }
`;

/* [2] 글 읽기 (Detail) 스타일 */
export const DetailView = styled.div`
  color: #fff;

  h3 {
    font-size: 28px;
    margin-bottom: 15px;
    color: var(--accent-cyan);
  }

  .meta {
    display: flex;
    gap: 20px;
    color: var(--text-gray);
    font-size: 14px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 30px;
  }

  .body {
    font-size: 16px;
    line-height: 1.8;
    min-height: 300px;
    white-space: pre-wrap;
  }

  .btn-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 20px;
  }
`;

/* [3] 글 쓰기 (Write) 스타일 */
export const WriteForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  input,
  textarea {
    width: 100%;
    padding: 15px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    &:focus {
      outline: none;
      border-color: var(--accent-cyan);
    }
  }

  textarea {
    height: 400px;
    resize: none;
  }

  .rating-select {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    select {
      padding: 10px;
      border-radius: 5px;
      background: #333;
      color: #fff;
      border: 1px solid #555;
    }
  }
`;

export const ActionBtn = styled.button<{ $outline?: boolean }>`
  padding: 10px 25px;
  border-radius: 5px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;

  background: ${(props) =>
    props.$outline ? "transparent" : "var(--accent-cyan)"};
  color: ${(props) => (props.$outline ? "#aaa" : "#000")};
  border: ${(props) => (props.$outline ? "1px solid #555" : "none")};

  &:hover {
    background: ${(props) =>
      props.$outline ? "rgba(255,255,255,0.1)" : "#00dbe6"};
    color: ${(props) => (props.$outline ? "#fff" : "#000")};
  }
`;

export const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #888;
  font-size: 16px; /* 폰트 크기도 살짝 지정해주면 좋습니다 */
`;

export const RatingText = styled.span`
  color: #ffdd57;
`;
