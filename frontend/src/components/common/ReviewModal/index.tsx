import { useState, useEffect } from "react";
import { api } from "../../../api/axios"; // [FIX] 진짜 API 도구 가져오기
import * as S from "./style";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// [FIX] 백엔드에서 주는 데이터 모양(DTO)에 맞춤
interface ReviewData {
  id: number;
  title: string;
  content: string;
  writerName: string; // backend: writerName
  rating: number;
  date: string; // backend: date
}

const ITEMS_PER_PAGE = 5; // 한 페이지에 5개씩 보기

const ReviewModal = ({ isOpen, onClose }: Props) => {
  const [view, setView] = useState<"LIST" | "DETAIL" | "WRITE">("LIST");
  const [currentPage, setCurrentPage] = useState(1);

  // [FIX] 가짜 데이터 대신 서버에서 받아올 공간(State)
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  // 글쓰기 입력값 상태
  const [writeForm, setWriteForm] = useState({
    title: "",
    content: "",
    rating: 5,
  });

  // 1. 후기 목록 불러오기 (백엔드 통신)
  const fetchReviews = async () => {
    try {
      // GET /api/posts/reviews
      const response = await api.get("/posts/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error("후기 로딩 실패:", error);
    }
  };

  // 모달 열릴 때마다 목록 새로고침
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setView("LIST");
      setCurrentPage(1);
      fetchReviews(); // [FIX] 서버에 "목록 줘!" 요청
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // 2. 후기 등록하기 (백엔드 통신)
  const handleSubmitReview = async () => {
    if (!writeForm.title || !writeForm.content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      // POST /api/posts/reviews
      await api.post("/posts/reviews", {
        title: writeForm.title,
        content: writeForm.content,
        rating: writeForm.rating,
      });

      alert("후기가 등록되었습니다!");

      // 입력창 초기화 및 목록으로 복귀
      setWriteForm({ title: "", content: "", rating: 5 });
      setView("LIST");
      fetchReviews(); // [FIX] 목록 갱신 (내 글이 바로 보이게)
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
      } else {
        alert("후기 등록 중 오류가 발생했습니다.");
      }
    }
  };

  if (!isOpen) return null;

  // [Paging Logic] - 받아온 reviews 데이터로 계산
  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const currentItems = reviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
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

              {/* [FIX] 데이터가 없을 때 안내 문구 */}
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
                    <div className="author">{item.writerName}</div>{" "}
                    {/* writerName 사용 */}
                    <div className="date">{item.date}</div>
                  </S.ReviewItem>
                ))
              )}

              {/* 페이지네이션 (데이터 있을 때만 표시) */}
              {reviews.length > 0 && (
                <S.Pagination>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  {/* 페이지 번호 단순화 (너무 많으면 ... 처리 대신 5개까지만 보여주거나 전체 표시) */}
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

              <S.WriteBtn onClick={() => setView("WRITE")}>✎ 글쓰기</S.WriteBtn>
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
                <S.ActionBtn onClick={handleSubmitReview}>등록하기</S.ActionBtn>
              </div>
            </S.WriteForm>
          )}
        </S.Content>
      </S.Container>
    </S.Overlay>
  );
};

export default ReviewModal;
