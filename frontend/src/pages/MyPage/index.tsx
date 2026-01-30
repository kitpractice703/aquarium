import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import * as S from "./style";

const MyPage = () => {
  const { username } = useAuth();
  const [reservations, setReservations] = useState<any[]>([]);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // [ADDED] 전화번호 포맷팅 함수 (회원가입과 동일)
  const formatPhoneNumber = (value: string) => {
    const raw = value.replace(/[^0-9]/g, ""); // 숫자 이외 제거

    if (raw.length <= 3) {
      return raw;
    } else if (raw.length <= 7) {
      return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else {
      return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
  };

  // [ADDED] 전화번호 전용 핸들러
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

    // 실제로는 여기서 백엔드로 currentPassword와 함께 수정 요청을 보냅니다.
    alert("회원정보 수정 기능은 준비 중입니다. (UI 데모)");
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
          {/* [SECTION 1] 내 정보 관리 */}
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

              {/* [MODIFIED] 전화번호 입력 필드 수정 (핸들러 교체 및 maxLength 추가) */}
              <S.InputGroup>
                <label>전화번호</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="010-0000-0000 (숫자만 입력)"
                  value={form.phone}
                  onChange={handlePhoneChange} // [변경] 전용 핸들러 연결
                  maxLength={13} // [추가] 길이 제한
                />
              </S.InputGroup>

              <div style={{ marginTop: "auto" }}>
                <S.UpdateButton onClick={handleUpdateInfo}>
                  정보 수정 저장
                </S.UpdateButton>
              </div>
            </S.InfoForm>
          </S.Section>

          {/* ... (예매 내역 섹션 유지) ... */}
          <S.Section>
            <S.SectionTitle>
              예매 내역 <span>({reservations.length}건)</span>
            </S.SectionTitle>

            <S.TicketList>
              {reservations.length === 0 ? (
                <S.EmptyMsg>예매 내역이 없습니다.</S.EmptyMsg>
              ) : (
                reservations.map((ticket) => (
                  <S.TicketCard key={ticket.id}>
                    <S.TicketInfo>
                      <div className="res-number">No. {ticket.id}</div>
                      <div className="title">
                        {ticket.programTitle || "Naquarium 입장권"}
                      </div>
                      <div className="details">
                        <span className="location">
                          {ticket.location || "Naquarium 본관"}
                        </span>
                        <span className="date-time">
                          {ticket.startTime
                            ? new Date(ticket.startTime).toLocaleDateString()
                            : "날짜 정보 없음"}
                        </span>
                      </div>
                    </S.TicketInfo>

                    <S.TicketStatus $status={ticket.status}>
                      {ticket.status === "CONFIRMED" ? "예매 완료" : "취소됨"}
                    </S.TicketStatus>
                  </S.TicketCard>
                ))
              )}
            </S.TicketList>
          </S.Section>
        </S.ContentGrid>
      </S.Inner>
    </S.Container>
  );
};

export default MyPage;
