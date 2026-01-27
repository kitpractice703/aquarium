import styled from "styled-components";

export const FooterContainer = styled.footer`
  width: 100%;
  padding: 50px 0;
  background-color: #05080f; /* 헤더보다 조금 더 어두운 색 */
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: auto; /* 내용이 짧아도 바닥에 붙게 */
`;

export const Inner = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 30px;
    text-align: center;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Logo = styled.h2`
  font-size: 20px;
  color: var(--text-gray);
  margin-bottom: 10px;
`;

export const Text = styled.p`
  font-size: 14px;
  color: #555;
  line-height: 1.5;
`;

export const Copyright = styled.span`
  font-size: 12px;
  color: #444;
  margin-top: 10px;
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: 20px;
`;

export const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: var(--accent-cyan);
    color: #000;
  }
`;
