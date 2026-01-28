import { useState, useEffect } from "react";
import * as S from "./style";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// [가상 데이터] DB 연결 전까지 사용할 더미 데이터 (25개)
const MOCK_REVIEWS = Array.from({ length: 25 }, (_, i) => ({
  id: 25 - i,
  title: `너무 환상적인 경험이었습니다! (${25 - i})`,
  author: `user${25 - i}`,
  date: "2026-01-28",
  rating: 5,
  content:
    "아이들과 함께 다녀왔는데 VR 체험이 정말 실감났습니다.\n특히 심해관의 조명 연출은 감동 그 자체였어요. \n다음에 부모님 모시고 또 오고 싶습니다. 강추합니다!",
}));

const ITEMS_PER_PAGE = 10;

const ReviewModal = ({ isOpen, onClose }: Props) => {
  const [view, setView] = useState<"LIST" | "DETAIL" | "WRITE">("LIST");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setView("LIST");
      setCurrentPage(1);
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // [Paging Logic]
  const totalPages = Math.ceil(MOCK_REVIEWS.length / ITEMS_PER_PAGE);
  const currentItems = MOCK_REVIEWS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // [Handlers]
  const handleReviewClick = (review: any) => {
    setSelectedReview(review);
    setView("DETAIL");
  };

  const handleBackToList = () => {
    setView("LIST");
    setSelectedReview(null);
  };

  const handleSubmitReview = () => {
    alert("소중한 후기 감사합니다! (DB 저장 예정)");
    setView("LIST");
  };

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

              {currentItems.map((item) => (
                <S.ReviewItem
                  key={item.id}
                  onClick={() => handleReviewClick(item)}
                >
                  <div className="title">{item.title}</div>
                  <div className="rating">{"★".repeat(item.rating)}</div>
                  <div className="author">{item.author}</div>
                  <div className="date">{item.date}</div>
                </S.ReviewItem>
              ))}

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

              <S.WriteBtn onClick={() => setView("WRITE")}>✎ 글쓰기</S.WriteBtn>
            </>
          )}

          {/* ================= DETAIL VIEW ================= */}
          {view === "DETAIL" && selectedReview && (
            <S.DetailView>
              <h3>{selectedReview.title}</h3>
              <div className="meta">
                <span>작성자: {selectedReview.author}</span>
                <span>날짜: {selectedReview.date}</span>
                <span style={{ color: "#ffdd57" }}>
                  평점: {"★".repeat(selectedReview.rating)}
                </span>
              </div>
              <div className="body">{selectedReview.content}</div>

              <div className="btn-group">
                <S.ActionBtn $outline onClick={handleBackToList}>
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
                <select>
                  <option value="5">★★★★★ (5점)</option>
                  <option value="4">★★★★☆ (4점)</option>
                  <option value="3">★★★☆☆ (3점)</option>
                </select>
              </div>
              <input type="text" placeholder="제목을 입력해주세요" />
              <textarea placeholder="관람 후기를 자유롭게 작성해주세요. (욕설 및 비방은 제재될 수 있습니다)" />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <S.ActionBtn $outline onClick={handleBackToList}>
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
