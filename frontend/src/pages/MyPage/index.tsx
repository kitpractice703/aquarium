/**
 * 마이페이지 컴포넌트
 * - 좌: 내 정보 관리 (비밀번호 변경 + 전화번호 수정)
 * - 우: 예매 내역 목록 (관람권 / 체험 / 공연 구분 배지)
 * - 비밀번호 변경 시 자동 로그아웃
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

  /** 프로그램 타입별 배지 렌더링 */
  const renderBadge = (type?: string) => {
    if (type === "PERFORMANCE") {
      return <S.Badge $type="PERFORMANCE">[공연]</S.Badge>;
    }
    if (type === "EXPERIENCE") {
      return <S.Badge $type="EXPERIENCE">[체험]</S.Badge>;
    }
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
          {/* 좌측: 내 정보 관리 */}
          <S.Section>
            <S.SectionTitle>내 정보 관리</S.SectionTitle>
            <S.InfoForm>
              {/* 이메일 (읽기 전용) */}
              <S.InputGroup>
                <label>아이디 (이메일)</label>
                <input type="text" value={username || ""} disabled readOnly />
              </S.InputGroup>
              {/* 현재 비밀번호 (본인 확인용) */}
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
              {/* 새 비밀번호 */}
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
              {/* 새 비밀번호 확인 */}
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
              {/* 전화번호 (자동 하이픈 포맷) */}
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

          {/* 우측: 예매 내역 */}
          <S.Section>
            <S.SectionTitle>
              예매 내역 <span>({reservations.length}건)</span>
            </S.SectionTitle>
            <S.TicketList>
              {reservations.length === 0 ? (
                <S.EmptyMsg>예매 내역이 없습니다.</S.EmptyMsg>
              ) : (
                reservations.map((ticket) => {
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
                          {renderBadge(ticket.programType)}
                          {ticket.programTitle}
                        </div>
                        <div className="details">
                          <span className="location">
                            {ticket.location || "Naquarium 본관"}
                          </span>
                          <span className="date-time">
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
