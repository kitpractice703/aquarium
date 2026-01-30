import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import * as S from "./style";
// 타입 import 추가
import type { ReservationDto } from "../../types/api";

const MyPage = () => {
  const { username } = useAuth();
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get<ReservationDto[]>("/reservations/me");
        setReservations(res.data);
      } catch (err) {
        console.error("내역 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatPhoneNumber = (value: string) => {
    const raw = value.replace(/[^0-9]/g, "");
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setForm((prev) => ({ ...prev, phone: formatted }));
  };

  const handleUpdateInfo = () => {
    if (!form.currentPassword) {
      alert("본인 확인을 위해 현재 비밀번호를 입력해주세요.");
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    alert("회원정보 수정 기능은 준비 중입니다. (UI 데모)");
  };

  // [핵심] 뱃지 렌더링 함수
  const renderBadge = (type?: string) => {
    if (type === "PERFORMANCE") {
      return (
        <span style={{ color: "#ff6b6b", marginRight: "6px" }}>[공연]</span>
      );
    }
    if (type === "EXPERIENCE") {
      return (
        <span style={{ color: "#ffdd57", marginRight: "6px" }}>[체험]</span>
      );
    }
    return null; // 입장권은 뱃지 없음
  };

  if (loading)
    return (
      <div style={{ paddingTop: "100px", textAlign: "center", color: "white" }}>
        Loading...
      </div>
    );

  return (
    <S.Container>
      <S.Inner>
        <S.PageHeader>
          <S.Title>MY PAGE</S.Title>
        </S.PageHeader>

        <S.ContentGrid>
          <S.Section>
            <S.SectionTitle>내 정보 관리</S.SectionTitle>
            <S.InfoForm>
              <S.InputGroup>
                <label>아이디 (이메일)</label>
                <input type="text" value={username || ""} disabled readOnly />
              </S.InputGroup>
              <S.InputGroup>
                <label>현재 비밀번호</label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="현재 비밀번호 입력"
                  value={form.currentPassword}
                  onChange={handleChange}
                />
              </S.InputGroup>
              <S.InputGroup>
                <label>새 비밀번호</label>
                <input
                  type="password"
                  name="password"
                  placeholder="변경할 비밀번호 (선택)"
                  value={form.password}
                  onChange={handleChange}
                />
              </S.InputGroup>
              <S.InputGroup>
                <label>새 비밀번호 확인</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="비밀번호 재입력"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </S.InputGroup>
              <S.InputGroup>
                <label>전화번호</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="숫자만 입력가능합니다."
                  value={form.phone}
                  onChange={handlePhoneChange}
                  maxLength={13}
                />
              </S.InputGroup>
              <div style={{ marginTop: "auto" }}>
                <S.UpdateButton onClick={handleUpdateInfo}>
                  정보 수정 저장
                </S.UpdateButton>
              </div>
            </S.InfoForm>
          </S.Section>

          <S.Section>
            <S.SectionTitle>
              예매 내역 <span>({reservations.length}건)</span>
            </S.SectionTitle>
            <S.TicketList>
              {reservations.length === 0 ? (
                <S.EmptyMsg>예매 내역이 없습니다.</S.EmptyMsg>
              ) : (
                reservations.map((ticket) => {
                  // 프로그램(공연/체험) 여부 판단
                  const isProgram =
                    ticket.programType === "PERFORMANCE" ||
                    ticket.programType === "EXPERIENCE";

                  return (
                    <S.TicketCard key={ticket.id} $isProgram={isProgram}>
                      <S.TicketInfo>
                        <div className="res-number">
                          {ticket.ticketNumber || `T-${ticket.id}`}
                        </div>
                        <div className="title">
                          {/* 뱃지 표시 */}
                          {renderBadge(ticket.programType)}
                          {ticket.programTitle}
                        </div>
                        <div className="details">
                          <span className="location">
                            {ticket.location || "Naquarium 본관"}
                          </span>
                          <span className="date-time">
                            {/* 방문 날짜와 시간(종일권 아닐 때만) 표시 */}
                            {ticket.visitDate}
                            {ticket.visitTime && ticket.visitTime !== "종일권"
                              ? ` ${ticket.visitTime}`
                              : ""}
                          </span>
                        </div>
                      </S.TicketInfo>
                      <S.TicketStatus $status={ticket.status}>
                        {ticket.status === "CONFIRMED" ? "예매 완료" : "취소됨"}
                      </S.TicketStatus>
                    </S.TicketCard>
                  );
                })
              )}
            </S.TicketList>
          </S.Section>
        </S.ContentGrid>
      </S.Inner>
    </S.Container>
  );
};

export default MyPage;
