import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // [추가] 로그인 페이지 이동용
import { api } from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext"; // [추가] 로그인 상태 확인용
import * as S from "./style";
import LoginRequestModal from "../LoginRequestModal"; // [추가] 안내 모달

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
  const navigate = useNavigate(); // [추가]
  const { isLoggedIn } = useAuth(); // [추가] 로그인 상태 가져오기

  const [view, setView] = useState<"LIST" | "DETAIL" | "WRITE">("LIST");
  const [currentPage, setCurrentPage] = useState(1);

  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);

  // [추가] 로그인 안내 모달 상태
  const [isLoginNoticeOpen, setIsLoginNoticeOpen] = useState(false);

  const [writeForm, setWriteForm] = useState({
    title: "",
    content: "",
    rating: 5,
  });

  const fetchReviews = async () => {
    try {
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

  // [수정] 글쓰기 버튼 클릭 핸들러 (로그인 체크)
  const handleWriteClick = () => {
    if (isLoggedIn) {
      setView("WRITE"); // 로그인 상태면 글쓰기 화면으로
    } else {
      setIsLoginNoticeOpen(true); // 아니면 안내 모달 띄우기
    }
  };

  const handleSubmitReview = async () => {
    if (!writeForm.title || !writeForm.content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await api.post("/posts/reviews", {
        title: writeForm.title,
        content: writeForm.content,
        rating: writeForm.rating,
      });

      alert("후기가 등록되었습니다!");

      setWriteForm({ title: "", content: "", rating: 5 });
      setView("LIST");
      fetchReviews();
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        // 혹시라도 여기서 401이 나면 안내 모달 띄우기
        setIsLoginNoticeOpen(true);
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

                {/* [수정] 핸들러 교체 */}
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

      {/* [추가] 로그인 안내 모달 */}
      <LoginRequestModal
        isOpen={isLoginNoticeOpen}
        onClose={() => setIsLoginNoticeOpen(false)}
        onConfirm={() => {
          setIsLoginNoticeOpen(false);
          onClose(); // 리뷰 모달도 닫아주는 게 자연스러움
          navigate("/login"); // 로그인 페이지로 이동
        }}
      />
    </>
  );
};

export default ReviewModal;
