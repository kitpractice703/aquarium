import { useState, useEffect } from "react";
import { api } from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import { updateUserInfo } from "../../../api/authApi";
import type { ReservationDto } from "../../../types/api";

export const useMyPage = () => {
  const { username, logout } = useAuth();
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // 1. 예약 내역 조회
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

  // 2. 전화번호 포맷팅 유틸리티
  const formatPhoneNumber = (value: string) => {
    const raw = value.replace(/[^0-9]/g, "");
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  // 3. 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setForm((prev) => ({ ...prev, phone: formatted }));
  };

  // 4. 정보 수정 요청 핸들러
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
