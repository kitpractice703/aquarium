import { useDashboard } from "./hooks/useDashboard";
import * as S from "../shared/style";
import * as PS from "./style";

const Dashboard = () => {
  const { stats, stars } = useDashboard();

  return (
    <div>
      <S.PageTitle>대시보드</S.PageTitle>
      <PS.StatGrid>
        <PS.StatCard>
          <PS.StatLabel>오늘 예약</PS.StatLabel>
          <PS.StatValue>{stats?.todayReservations ?? "-"}</PS.StatValue>
        </PS.StatCard>
        <PS.StatCard>
          <PS.StatLabel>이번 주 일정</PS.StatLabel>
          <PS.StatValue>{stats?.weekSchedules ?? "-"}</PS.StatValue>
        </PS.StatCard>
        <PS.StatCard>
          <PS.StatLabel>전체 회원</PS.StatLabel>
          <PS.StatValue>{stats?.totalUsers ?? "-"}</PS.StatValue>
        </PS.StatCard>
        <PS.StatCard>
          <PS.StatLabel>최근 후기</PS.StatLabel>
          <PS.StatValue>{stats?.recentReviews?.length ?? "-"}</PS.StatValue>
        </PS.StatCard>
      </PS.StatGrid>

      <S.Card>
        <S.PageTitle style={{ fontSize: 16, marginBottom: 16 }}>최근 후기</S.PageTitle>
        <S.Table>
          <thead>
            <tr>
              <S.Th>작성자</S.Th>
              <S.Th>제목</S.Th>
              <S.Th>평점</S.Th>
              <S.Th>작성일</S.Th>
            </tr>
          </thead>
          <tbody>
            {!stats?.recentReviews?.length ? (
              <S.EmptyRow><td colSpan={4}>후기가 없습니다.</td></S.EmptyRow>
            ) : (
              stats.recentReviews.map((r) => (
                <S.Tr key={r.id}>
                  <S.Td>{r.writerName}</S.Td>
                  <S.Td>{r.title}</S.Td>
                  <S.Td style={{ color: "#ffa502" }}>{stars(r.rating)} ({r.rating})</S.Td>
                  <S.Td>{r.createdAt}</S.Td>
                </S.Tr>
              ))
            )}
          </tbody>
        </S.Table>
      </S.Card>
    </div>
  );
};

export default Dashboard;
