import { useReviews } from "./hooks/useReviews";
import * as S from "../shared/style";

const Reviews = () => {
  const { reviews, detail, setDetail, handleDelete, stars } = useReviews();

  return (
    <div>
      <S.PageTitle>후기 관리</S.PageTitle>

      <S.Card>
        <S.Table>
          <thead>
            <tr>
              <S.Th>작성자</S.Th>
              <S.Th>제목</S.Th>
              <S.Th>평점</S.Th>
              <S.Th>작성일</S.Th>
              <S.Th>변경</S.Th>
            </tr>
          </thead>
          <tbody>
            {!reviews.length ? (
              <S.EmptyRow><td colSpan={5}>후기가 없습니다.</td></S.EmptyRow>
            ) : (
              reviews.map((r) => (
                <S.Tr key={r.id}>
                  <S.Td>
                    <div>{r.writerName}</div>
                    <div style={{ fontSize: 11, color: "#5a7a9a" }}>{r.writerEmail}</div>
                  </S.Td>
                  <S.Td>{r.title}</S.Td>
                  <S.Td style={{ color: "#ffa502", letterSpacing: 1 }}>{stars(r.rating)}</S.Td>
                  <S.Td>{r.createdAt}</S.Td>
                  <S.Td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <S.Btn onClick={() => setDetail(r)}>상세</S.Btn>
                      <S.Btn $variant="danger" onClick={() => handleDelete(r)}>삭제</S.Btn>
                    </div>
                  </S.Td>
                </S.Tr>
              ))
            )}
          </tbody>
        </S.Table>
      </S.Card>

      {detail && (
        <S.Overlay>
          <S.Modal>
            <S.ModalTitle>{detail.title}</S.ModalTitle>
            <div style={{ marginBottom: 8, fontSize: 13, color: "#8aacc8" }}>
              {detail.writerName} · {detail.createdAt} ·{" "}
              <span style={{ color: "#ffa502" }}>{stars(detail.rating)}</span>
            </div>
            <div style={{ fontSize: 14, color: "#c0d4e8", lineHeight: 1.7, marginBottom: 20 }}>
              {detail.content}
            </div>
            <S.ModalActions>
              <S.Btn onClick={() => setDetail(null)}>닫기</S.Btn>
              <S.Btn $variant="danger" onClick={() => handleDelete(detail)}>삭제</S.Btn>
            </S.ModalActions>
          </S.Modal>
        </S.Overlay>
      )}
    </div>
  );
};

export default Reviews;
