import { useEffect, useState } from "react";
import { getAdminUsers, changeUserRole, deleteAdminUser } from "../../../api/adminApi";
import type { AdminUser } from "../../../types/api";
import * as S from "../shared/style";

const Users = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");

  const load = () =>
    getAdminUsers(search || undefined).then(setUsers).catch(console.error);

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (u: AdminUser) => {
    const newRole = u.role === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`${u.email} 의 권한을 ${newRole}로 변경하시겠습니까?`)) return;
    await changeUserRole(u.id, newRole);
    load();
  };

  const handleDelete = async (u: AdminUser) => {
    if (!confirm(`${u.email} 회원을 강제 탈퇴시키겠습니까?\n(예약 및 후기도 함께 삭제됩니다)`)) return;
    await deleteAdminUser(u.id);
    load();
  };

  return (
    <div>
      <S.PageTitle>회원 관리</S.PageTitle>
      <S.FilterRow>
        <S.Input
          placeholder="이름 또는 이메일 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          style={{ width: 240 }}
        />
        <S.Btn onClick={load}>검색</S.Btn>
      </S.FilterRow>

      <S.Card>
        <S.Table>
          <thead>
            <tr>
              <S.Th>이메일</S.Th>
              <S.Th>이름</S.Th>
              <S.Th>전화번호</S.Th>
              <S.Th>가입방법</S.Th>
              <S.Th>권한</S.Th>
              <S.Th>액션</S.Th>
            </tr>
          </thead>
          <tbody>
            {!users.length ? (
              <S.EmptyRow><td colSpan={6}>회원이 없습니다.</td></S.EmptyRow>
            ) : (
              users.map((u) => (
                <S.Tr key={u.id}>
                  <S.Td>{u.email}</S.Td>
                  <S.Td>{u.username}</S.Td>
                  <S.Td>{u.phone ?? "-"}</S.Td>
                  <S.Td>
                    <S.Badge $color={u.provider === "google" ? "#ea4335" : "#8aacc8"}>
                      {u.provider}
                    </S.Badge>
                  </S.Td>
                  <S.Td>
                    <S.Badge $color={u.role === "ADMIN" ? "#00d4ff" : undefined}>
                      {u.role}
                    </S.Badge>
                  </S.Td>
                  <S.Td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <S.Btn $variant="warning" onClick={() => handleRoleChange(u)}>
                        {u.role === "ADMIN" ? "USER로 변경" : "ADMIN 승격"}
                      </S.Btn>
                      <S.Btn $variant="danger" onClick={() => handleDelete(u)}>탈퇴</S.Btn>
                    </div>
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

export default Users;
