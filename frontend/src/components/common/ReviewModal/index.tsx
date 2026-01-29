// frontend/src/components/common/ReviewModal/index.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// [수정] 설정이 적용된 axios 인스턴스 사용
import { api } from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
// [수정] 스타일 컴포넌트 전체를 S로 가져오기
import * as S from "./style";
// [추가] 로그인 유도 모달
import LoginRequestModal from "../LoginRequestModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface ReviewData {
  id: number;
  title: string;
  content: string;
  writerName: string;
  rating: number;
  date: string;
}

const ITEMS_PER_PAGE = 5;

const ReviewModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  // [1] AuthContext에서 로그인 상태 가져오기
  const { isLoggedIn } = useAuth();

  const [view, setView] = useState<"LIST" | "DETAIL" | "WRITE">("LIST");
  const [currentPage, setCurrentPage] = useState(1);

  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  // [2] 로그인 안내 모달 표시 여부 상태
  const [isLoginNoticeOpen, setIsLoginNoticeOpen] = useState(false);

  const [writeForm, setWriteForm] = useState({
    title: "",
    content: "",
    rating: 5,
  });

  const fetchReviews = async () => {
    try {
      // [수정] api 인스턴스 사용
      const response = await api.get("/posts/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error("후기 로딩 실패:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setView("LIST");
      setCurrentPage(1);
      fetchReviews();
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // [3] 글쓰기 버튼 클릭 핸들러 (핵심 로직)
  const handleWriteClick = () => {
    if (isLoggedIn) {
      // 로그인 상태라면 글쓰기 화면으로 전환
      setView("WRITE");
    } else {
      // 비로그인 상태라면 로그인 요청 모달 띄우기
      setIsLoginNoticeOpen(true);
    }
  };

  const handleSubmitReview = async () => {
    if (!writeForm.title || !writeForm.content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      // [수정] api 인스턴스로 POST 요청
      await api.post("/posts/reviews", {
        title: writeForm.title,
        content: writeForm.content,
        rating: writeForm.rating,
      });

      alert("후기가 등록되었습니다!");

      setWriteForm({ title: "", content: "", rating: 5 });
      setView("LIST");
      fetchReviews(); // 목록 갱신
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        setIsLoginNoticeOpen(true); // 401 에러(토큰 만료 등) 시에도 안내 모달
      } else {
        alert("후기 등록 중 오류가 발생했습니다.");
      }
    }
  };

  if (!isOpen) return null;

  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const currentItems = reviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <>
      <S.Overlay onClick={onClose}>
        <S.Container onClick={(e) => e.stopPropagation()}>
          <S.Header>
            <h2>
              관람 후기 <span>Reviews</span>
            </h2>
            <S.CloseButton onClick={onClose}>&times;</S.CloseButton>
          </S.Header>

          <S.Content>
            {/* ================= LIST VIEW ================= */}
            {view === "LIST" && (
              <>
                <S.TableHeader>
                  <div className="title-col">제목</div>
                  <div>평점</div>
                  <div>작성자</div>
                  <div>날짜</div>
                </S.TableHeader>

                {reviews.length === 0 ? (
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    아직 등록된 후기가 없습니다. 첫 번째 주인공이 되어보세요!
                  </div>
                ) : (
                  currentItems.map((item) => (
                    <S.ReviewItem
                      key={item.id}
                      onClick={() => {
                        setSelectedReview(item);
                        setView("DETAIL");
                      }}
                    >
                      <div className="title">{item.title}</div>
                      <div className="rating">{"★".repeat(item.rating)}</div>
                      <div className="author">{item.writerName}</div>
                      <div className="date">{item.date}</div>
                    </S.ReviewItem>
                  ))
                )}

                {reviews.length > 0 && (
                  <S.Pagination>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          className={currentPage === pageNum ? "active" : ""}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      &gt;
                    </button>
                  </S.Pagination>
                )}

                {/* [4] 글쓰기 버튼에 핸들러 연결 */}
                <S.WriteBtn onClick={handleWriteClick}>✎ 글쓰기</S.WriteBtn>
              </>
            )}

            {/* ================= DETAIL VIEW ================= */}
            {view === "DETAIL" && selectedReview && (
              <S.DetailView>
                <h3>{selectedReview.title}</h3>
                <div className="meta">
                  <span>작성자: {selectedReview.writerName}</span>
                  <span>날짜: {selectedReview.date}</span>
                  <span style={{ color: "#ffdd57" }}>
                    평점: {"★".repeat(selectedReview.rating)}
                  </span>
                </div>
                <div className="body">{selectedReview.content}</div>

                <div className="btn-group">
                  <S.ActionBtn $outline onClick={() => setView("LIST")}>
                    목록으로
                  </S.ActionBtn>
                </div>
              </S.DetailView>
            )}

            {/* ================= WRITE VIEW ================= */}
            {view === "WRITE" && (
              <S.WriteForm>
                <div className="rating-select">
                  <span>평점:</span>
                  <select
                    value={writeForm.rating}
                    onChange={(e) =>
                      setWriteForm({
                        ...writeForm,
                        rating: Number(e.target.value),
                      })
                    }
                  >
                    <option value="5">★★★★★ (5점)</option>
                    <option value="4">★★★★☆ (4점)</option>
                    <option value="3">★★★☆☆ (3점)</option>
                    <option value="2">★★☆☆☆ (2점)</option>
                    <option value="1">★☆☆☆☆ (1점)</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="제목을 입력해주세요"
                  value={writeForm.title}
                  onChange={(e) =>
                    setWriteForm({ ...writeForm, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="관람 후기를 자유롭게 작성해주세요."
                  value={writeForm.content}
                  onChange={(e) =>
                    setWriteForm({ ...writeForm, content: e.target.value })
                  }
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <S.ActionBtn $outline onClick={() => setView("LIST")}>
                    취소
                  </S.ActionBtn>
                  <S.ActionBtn onClick={handleSubmitReview}>
                    등록하기
                  </S.ActionBtn>
                </div>
              </S.WriteForm>
            )}
          </S.Content>
        </S.Container>
      </S.Overlay>

      {/* [5] 비로그인 시 표시될 로그인 요청 모달 */}
      <LoginRequestModal
        isOpen={isLoginNoticeOpen}
        onClose={() => setIsLoginNoticeOpen(false)}
        onConfirm={() => {
          setIsLoginNoticeOpen(false); // 요청 모달 닫기
          onClose(); // 리뷰 모달도 닫기 (선택 사항: 원하시면 이 줄 삭제)
          navigate("/login"); // 로그인 페이지로 이동
        }}
      />
    </>
  );
};

export default ReviewModal;
