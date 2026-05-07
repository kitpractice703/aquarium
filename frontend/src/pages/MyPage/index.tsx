/**
 * 마이페이지
 *
 * 좌측: 회원정보 수정 (비밀번호·전화번호)
 * 우측: 예매 내역 목록 (오늘 이후 예매만 표시)
 *
 * 폼 상태·API 호출은 useMyPage 훅에서 관리한다.
 */
import * as S from "./style";
import { useMyPage } from "./hooks/useMypage";

const MyPage = () => {
  const {
    username,
    reservations,
    loading,
    form,
    handleChange,
    handlePhoneChange,
    handleUpdateInfo,
  } = useMyPage();

  /**
   * 예약 타입에 따라 배지를 렌더링한다.
   * ADMISSION(일반 입장권)은 배지 없음, 공연·체험만 표시한다.
   */
  const renderBadge = (type?: string) => {
    if (type === "PERFORMANCE") return <S.Badge $type="PERFORMANCE">[공연]</S.Badge>;
    if (type === "EXPERIENCE") return <S.Badge $type="EXPERIENCE">[체험]</S.Badge>;
    return null;
  };

  if (loading) return <S.LoadingWrapper>Loading...</S.LoadingWrapper>;

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
                {/* 이메일은 로그인 식별자이므로 수정 불가 */}
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
                  placeholder="변경할 경우에만 입력하세요"
                  value={form.password}
                  onChange={handleChange}
                />
              </S.InputGroup>
              <S.InputGroup>
                <label>새 비밀번호 확인</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="새 비밀번호 재입력"
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
                <S.UpdateButton onClick={handleUpdateInfo}>정보 수정 저장</S.UpdateButton>
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
                  // programType이 없거나 ADMISSION이면 일반 입장권 카드 스타일 적용
                  const isProgram =
                    ticket.programType === "PERFORMANCE" || ticket.programType === "EXPERIENCE";

                  return (
                    <S.TicketCard key={ticket.id} $isProgram={isProgram}>
                      <S.TicketInfo>
                        <div className="res-number">
                          {/* 발권 번호가 없으면 id로 대체 표시 */}
                          {ticket.ticketNumber || `T-${ticket.id}`}
                        </div>
                        <div className="title">
                          {renderBadge(ticket.programType)}
                          {ticket.programTitle}
                        </div>
                        <div className="details">
                          <span className="location">{ticket.location || "Naquarium 본관"}</span>
                          <span>
                            {ticket.visitDate}
                            {/* 종일권은 시간 표시 생략 */}
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
