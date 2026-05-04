import { useEffect, useState } from "react";
import { getAdminUsers, changeUserRole, deleteAdminUser } from "../../../../api/adminApi";
import type { AdminUser } from "../../../../types/api";

export const useUsers = () => {
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

  return { users, search, setSearch, load, handleRoleChange, handleDelete };
};
