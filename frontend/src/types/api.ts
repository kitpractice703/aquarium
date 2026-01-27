// axios를 쓴다면 이렇게 설정되어야 가장 깔끔합니다.
import axios from "axios";

const api = axios.create({
  baseURL: "", // 비워두세요! (프록시가 자동으로 8080으로 연결해줍니다)
  withCredentials: true, // 세션 유지(로그인)를 위해 필수
});

// 1. 전시 테마
export interface Exhibition {
  exhibitionId: number;
  title: string;
  subTitle: string;
  description: string;
  imageUrl: string;
  themeColor: string;
}

// 2. 프로그램
export interface Program {
  programId: number;
  title: string;
  description: string;
  content: string; // 상세 내용
  imageUrl: string;
}

// 3. 관람 후기 (게시판)
export interface Post {
  postId: number;
  title: string;
  content: string;
  author: string;
  createdDate: string; // LocalDateTime -> string
}

// 4. 자주 묻는 질문 (FAQ)
export interface Faq {
  faqId: number;
  question: string;
  answer: string;
}
export default api;
