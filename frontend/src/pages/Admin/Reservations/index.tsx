import { useEffect, useState } from "react";
import { getAdminReservations, cancelReservation } from "../../../api/adminApi";
import type { AdminReservation } from "../../../types/api";
import * as S from "../shared/style";

const Reservations = () => {
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");

  const load = () =>
    getAdminReservations({ date: filterDate, status: filterStatus, search })
      .then(setReservations)
      .catch(console.error);

  useEffect(() => { load(); }, []);

  const handleCancel = async (r: AdminReservation) => {
    if (!confirm(`[${r.ticketNumber}] 예약을 취소하시겠습니까?`)) return;
    await cancelReservation(r.id);
    load();
  };

  return (
    <div>
      <S.PageTitle>예약 관리</S.PageTitle>
      <S.FilterRow>
        <S.Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        <S.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="CONFIRMED">확정</option>
          <option value="CANCELLED">취소</option>
        </S.Select>
        <S.Input
          placeholder="이름 또는 이메일 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <S.Btn onClick={load}>조회</S.Btn>
      </S.FilterRow>

      <S.Card>
        <S.Table>
          <thead>
            <tr>
              <S.Th>티켓번호</S.Th>
              <S.Th>예약자</S.Th>
              <S.Th>프로그램</S.Th>
              <S.Th>방문일</S.Th>
              <S.Th>인원</S.Th>
              <S.Th>금액</S.Th>
              <S.Th>상태</S.Th>
              <S.Th>액션</S.Th>
            </tr>
          </thead>
          <tbody>
            {!reservations.length ? (
              <S.EmptyRow><td colSpan={8}>예약이 없습니다.</td></S.EmptyRow>
            ) : (
              reservations.map((r) => (
                <S.Tr key={r.id}>
                  <S.Td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.ticketNumber}</S.Td>
                  <S.Td>
                    <div>{r.userName}</div>
                    <div style={{ fontSize: 11, color: "#5a7a9a" }}>{r.userEmail}</div>
                  </S.Td>
                  <S.Td>{r.programTitle}</S.Td>
                  <S.Td>{r.visitDate}</S.Td>
                  <S.Td>성인 {r.adultCount} / 청소년 {r.teenCount}</S.Td>
                  <S.Td>₩{r.totalPrice.toLocaleString()}</S.Td>
                  <S.Td>
                    <S.Badge $color={r.status === "CONFIRMED" ? "#2ed573" : "#ff4757"}>
                      {r.status === "CONFIRMED" ? "확정" : "취소"}
                    </S.Badge>
                  </S.Td>
                  <S.Td>
                    {r.status === "CONFIRMED" && (
                      <S.Btn $variant="danger" onClick={() => handleCancel(r)}>취소</S.Btn>
                    )}
                  </S.Td>
                </S.Tr>
              ))
            )}
          </tbody>
        </S.Table>
      </S.Card>
    </div>
  );
};

export default Reservations;
