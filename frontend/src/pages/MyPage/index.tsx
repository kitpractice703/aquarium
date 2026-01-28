import { useEffect, useState } from "react";
import api from "../../types/api"; // api 인스턴스 가져오기
import * as S from "./style";

// 예약 내역 타입 정의 (백엔드 ReservationDto와 매칭)
interface ReservationDto {
  id: number;
  programTitle: string; // 프로그램 제목 (없으면 null일 수 있음)
  startTime: string; // 스케줄 시작 시간 (nullable)
  location: string;
  status: string;
  imageUrl: string;
  // 추가된 필드 대응 (백엔드 ReservationDto에 아직 없다면 무시될 수 있음)
}

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
