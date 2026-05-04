import { useEffect, useRef, useState } from "react";
import { getAdminReservations, cancelReservation } from "../../../../api/adminApi";
import type { AdminReservation } from "../../../../types/api";

const today = () => new Date().toISOString().split("T")[0];

export const useReservations = () => {
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [filterDate, setFilterDate] = useState(today());
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const dateRef = useRef<HTMLInputElement>(null);

  const load = () =>
    getAdminReservations({ date: filterDate, status: filterStatus, search })
      .then(setReservations)
      .catch(console.error);

  useEffect(() => { load(); }, []);

  const handleCancel = async (r: AdminReservation) => {
    if (!confirm(`[${r.ticketNumber}] 예약을 취소하시겠습니까?`)) return;
    await cancelReservation(r.id);
    load();
  };

  return {
    reservations, filterDate, setFilterDate, filterStatus, setFilterStatus,
    search, setSearch, dateRef, load, handleCancel,
  };
};
