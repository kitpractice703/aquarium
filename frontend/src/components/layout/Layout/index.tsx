/** 공통 레이아웃 컴포넌트 - Header + 메인 콘텐츠 영역 + Footer 구조 */
import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import * as S from "./style";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <S.LayoutWrapper>
      <Header />
      <S.MainContent>{children}</S.MainContent>
      <Footer />
    </S.LayoutWrapper>
  );
};

export default Layout;
