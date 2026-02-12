/**
 * 관람 후기 모달 컴포넌트
 * - 3개 뷰: LIST(목록) / DETAIL(상세) / WRITE(작성)
 * - 페이지네이션: 5건씩 표시
 * - 비로그인 시 글쓰기 클릭 → 로그인 안내 모달 표시
 */
import * as S from "./style";
import LoginRequestModal from "../LoginRequestModal";
import LoginModal from "../LoginModal";
import { useReview } from "./hooks/useReview";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal = ({ isOpen, onClose }: Props) => {
  const {
    view,
    setView,
    currentPage,
    setCurrentPage,
    reviews,
    currentItems,
    totalPages,
    selectedReview,
    setSelectedReview,
    writeForm,
    setWriteForm,
    handleWriteClick,
    handleSubmitReview,
    isLoginNoticeOpen,
    setIsLoginNoticeOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
  } = useReview(isOpen);

  if (!isOpen) return null;

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
            {/* 목록 뷰 */}
            {view === "LIST" && (
              <>
                <S.TableHeader>
                  <div className="title-col">제목</div>
                  <div>평점</div>
                  <div>작성자</div>
                  <div>날짜</div>
                </S.TableHeader>

                {reviews.length === 0 ? (
                  <S.EmptyMessage>
                    아직 등록된 후기가 없습니다. 첫 번째 주인공이 되어보세요!
                  </S.EmptyMessage>
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

                {/* 페이지네이션 */}
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

                <S.WriteBtn onClick={handleWriteClick}>✎ 글쓰기</S.WriteBtn>
              </>
            )}

            {/* 상세 뷰 */}
            {view === "DETAIL" && selectedReview && (
              <S.DetailView>
                <h3>{selectedReview.title}</h3>
                <div className="meta">
                  <span>작성자: {selectedReview.writerName}</span>
                  <span>날짜: {selectedReview.date}</span>
                  <S.RatingText>
                    평점: {"★".repeat(selectedReview.rating)}
                  </S.RatingText>
                </div>
                <div className="body">{selectedReview.content}</div>

                <div className="btn-group">
                  <S.ActionBtn $outline onClick={() => setView("LIST")}>
                    목록으로
                  </S.ActionBtn>
                </div>
              </S.DetailView>
            )}

            {/* 작성 뷰 */}
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
                    {[5, 4, 3, 2, 1].map((score) => (
                      <option key={score} value={score}>
                        {"★".repeat(score)} ({score}점)
                      </option>
                    ))}
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

      {/* 로그인 필요 안내 모달 */}
      <LoginRequestModal
        isOpen={isLoginNoticeOpen}
        onClose={() => setIsLoginNoticeOpen(false)}
        onConfirm={() => {
          setIsLoginNoticeOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOpenSignup={() => {
          setIsLoginModalOpen(false);
          window.location.href = "/signup";
        }}
        onOpenReset={() => {
          setIsLoginModalOpen(false);
          alert("비밀번호 찾기는 상단 메뉴를 이용해주세요.");
        }}
      />
    </>
  );
};

export default ReviewModal;
