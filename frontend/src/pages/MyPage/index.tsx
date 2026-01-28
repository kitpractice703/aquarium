import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import * as S from "./style";

const MyPage = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get("/reservations/me");
        setReservations(res.data);
      } catch (err) {
        console.error("내역 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading)
    return (
      <div style={{ paddingTop: "100px", textAlign: "center", color: "white" }}>
        Loading...
      </div>
    );

  return (
    <S.Container>
      <S.Inner>
        <S.Title>
          MY <span>TICKET</span>
        </S.Title>

        <S.TicketList>
          {reservations.length === 0 ? (
            <S.EmptyMsg>예매 내역이 없습니다.</S.EmptyMsg>
          ) : (
            reservations.map((ticket) => (
              <S.TicketCard key={ticket.id}>
                <S.TicketInfo>
                  {/* DTO에 visitDate가 아직 없으므로 reservedAt이나 startTime 활용 */}
                  <div className="date">예약번호 #{ticket.id}</div>
                  <div className="title">
                    {ticket.programTitle
                      ? ticket.programTitle
                      : "Naquarium 입장권"}
                  </div>
                  <div className="details">
                    {/* 백엔드 DTO에 visitDate, visitTime 필드가 추가되면 여기 수정 필요 */}
                    장소: {ticket.location || "Naquarium 본관"}
                  </div>
                </S.TicketInfo>
                <S.TicketStatus $status={ticket.status}>
                  {ticket.status === "CONFIRMED" ? "예매 완료" : "취소됨"}
                </S.TicketStatus>
              </S.TicketCard>
            ))
          )}
        </S.TicketList>
      </S.Inner>
    </S.Container>
  );
};

export default MyPage;
