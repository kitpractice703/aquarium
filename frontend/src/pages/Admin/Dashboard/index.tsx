import { useEffect, useState } from "react";
import { getDashboardStats } from "../../../api/adminApi";
import type { DashboardStats } from "../../../types/api";
import * as S from "../shared/style";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div>
      <S.PageTitle>대시보드</S.PageTitle>
      <S.StatGrid>
        <S.StatCard>
          <S.StatLabel>오늘 예약</S.StatLabel>
          <S.StatValue>{stats?.todayReservations ?? "-"}</S.StatValue>
        </S.StatCard>
        <S.StatCard>
          <S.StatLabel>이번 주 일정</S.StatLabel>
          <S.StatValue>{stats?.weekSchedules ?? "-"}</S.StatValue>
        </S.StatCard>
        <S.StatCard>
          <S.StatLabel>전체 회원</S.StatLabel>
          <S.StatValue>{stats?.totalUsers ?? "-"}</S.StatValue>
        </S.StatCard>
        <S.StatCard>
          <S.StatLabel>최근 후기</S.StatLabel>
          <S.StatValue>{stats?.recentReviews?.length ?? "-"}</S.StatValue>
        </S.StatCard>
      </S.StatGrid>

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
                  <S.Td>{"★".repeat(Math.round(r.rating))} ({r.rating})</S.Td>
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
