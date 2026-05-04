import { useEffect, useRef, useState } from "react";
import {
  getAdminSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  toggleSchedule,
  getAdminPrograms,
} from "../../../../api/adminApi";
import type { AdminSchedule, AdminProgram } from "../../../../types/api";

const EMPTY_FORM = { programId: 0, location: "", startTime: "" };
const today = () => new Date().toISOString().split("T")[0];

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<AdminSchedule[]>([]);
  const [programs, setPrograms] = useState<AdminProgram[]>([]);
  const [filterDate, setFilterDate] = useState(today());
  const [filterType, setFilterType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminSchedule | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const dateRef = useRef<HTMLInputElement>(null);

  const load = () =>
    getAdminSchedules(filterDate || undefined).then(setSchedules).catch(console.error);

  useEffect(() => {
    load();
    getAdminPrograms().then(setPrograms).catch(console.error);
  }, []);

  const filtered = schedules.filter((s) => !filterType || s.programType === filterType);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };

  const openEdit = (s: AdminSchedule) => {
    setEditing(s);
    setForm({ programId: s.programId, location: s.location, startTime: s.startTime });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.programId || !form.location || !form.startTime) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    try {
      if (editing) {
        await updateSchedule(editing.id, editing.programType, form);
      } else {
        await createSchedule(form);
      }
      setModalOpen(false);
      load();
    } catch {
      alert("저장에 실패했습니다.");
    }
  };

  const handleDelete = async (s: AdminSchedule) => {
    if (!confirm(`[${s.programTitle}] ${s.startTime} 일정을 삭제하시겠습니까?`)) return;
    await deleteSchedule(s.id, s.programType);
    load();
  };

  const handleToggle = async (s: AdminSchedule) => {
    await toggleSchedule(s.id, s.programType);
    load();
  };

  return {
    schedules, programs, filterDate, setFilterDate, filterType, setFilterType,
    modalOpen, setModalOpen, editing, form, setForm, dateRef, filtered,
    load, openCreate, openEdit, handleSubmit, handleDelete, handleToggle,
  };
};
