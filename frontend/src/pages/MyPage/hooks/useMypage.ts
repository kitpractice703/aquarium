import {useState, useEffect} from "react";
import {getMyReservations} from "../../../api/reservationApi";
import {useAuth} from "../../../context/AuthContext";
import {updateUserInfo} from "../../../api/authApi";
import type {ReservationDto} from "../../../types/api";

export const useMyPage = () => {
  const {username, logout} = useAuth();
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
        const data = await getMyReservations();
        // 당일 이후 예매건만 표시
        const today = new Date().toISOString().slice(0, 10);
        setReservations(data.filter((r) => r.visitDate >= today));
      } catch (err) {
        console.error("내역 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const formatPhoneNumber = (value: string) => {
    const raw = value.replace(/[^0-9]/g, "");
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({...prev, phone: formatPhoneNumber(e.target.value)}));
  };

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
        setForm((prev) => ({...prev, currentPassword: "", password: "", confirmPassword: ""}));
      }
    } catch (error: any) {
      alert(error.response?.data || "정보 수정 중 오류가 발생했습니다.");
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
