// 백엔드 엔티티(Entity) 구조와 100% 일치시켰습니다.

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
