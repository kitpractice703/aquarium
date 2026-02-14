/**
 * 마이페이지 로직 커스텀 훅
 * - 내 예약 목록 조회 (GET /api/reservations/me)
 * - 회원정보 수정 (비밀번호 변경 + 전화번호 수정)
 * - 비밀번호 변경 시 자동 로그아웃 처리
 */
import { useState, useEffect } from "react";
import { api } from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import { updateUserInfo } from "../../../api/authApi";
import type { ReservationDto } from "../../../types/api";

export const useMyPage = () => {
  const { username, logout } = useAuth();
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [loading, setLoading] = useState(true);

  /** 회원정보 수정 폼 상태 */
  const [form, setForm] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  /** 마운트 시 내 예약 목록 조회 */
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get<ReservationDto[]>("/reservations/me");

        // 당일 이후 예매건만 표시 (과거 예매 제외)
        const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
        const filtered = res.data.filter(
          (r) => r.visitDate >= today
        );
        setReservations(filtered);
      } catch (err) {
        console.error("내역 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  /** 전화번호 자동 하이픈 포맷팅 (010-0000-0000) */
  const formatPhoneNumber = (value: string) => {
    const raw = value.replace(/[^0-9]/g, "");
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setForm((prev) => ({ ...prev, phone: formatted }));
  };

  /**
   * 회원정보 수정 처리
   * - 현재 비밀번호 필수 (본인 확인)
   * - 새 비밀번호 입력 시 비밀번호 변경 + 자동 로그아웃
   * - 비밀번호 미입력 시 전화번호만 수정
   */
  const handleUpdateInfo = async () => {
    if (!form.currentPassword) {
      alert("본인 확인을 위해 현재 비밀번호를 입력해주세요.");
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await updateUserInfo({
        currentPassword: form.currentPassword,
        password: form.password,
        phone: form.phone,
      });

      if (form.password && form.password.trim() !== "") {
        alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
        await logout();
      } else {
        alert("회원정보가 성공적으로 수정되었습니다.");
        setForm((prev) => ({
          ...prev,
          currentPassword: "",
          password: "",
          confirmPassword: "",
        }));
      }
    } catch (error: any) {
      console.error("수정 실패:", error);
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert("정보 수정 중 오류가 발생했습니다.");
      }
    }
  };

  return {
    username,
    reservations,
    loading,
    form,
    handleChange,
    handlePhoneChange,
    handleUpdateInfo,
  };
};
