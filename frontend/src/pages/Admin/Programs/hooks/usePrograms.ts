import { useEffect, useState } from "react";
import { getAdminPrograms, createProgram, updateProgram, deleteProgram } from "../../../../api/adminApi";
import type { AdminProgram, AdminProgramRequest } from "../../../../types/api";

const EMPTY_FORM: AdminProgramRequest = { title: "", description: "", type: "PERFORMANCE", price: 0 };

export const usePrograms = () => {
  const [programs, setPrograms] = useState<AdminProgram[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProgram | null>(null);
  const [form, setForm] = useState<AdminProgramRequest>(EMPTY_FORM);

  const load = () => getAdminPrograms().then(setPrograms).catch(console.error);

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };

  const openEdit = (p: AdminProgram) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, type: p.type, price: p.price });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price) { alert("제목과 가격을 입력해주세요."); return; }
    try {
      if (editing) { await updateProgram(editing.id, form); }
      else { await createProgram(form); }
      setModalOpen(false);
      load();
    } catch { alert("저장에 실패했습니다."); }
  };

  const handleDelete = async (p: AdminProgram) => {
    if (!confirm(`[${p.title}] 프로그램을 삭제하시겠습니까?`)) return;
    await deleteProgram(p.id);
    load();
  };

  return {
    programs, modalOpen, setModalOpen, editing, form, setForm,
    openCreate, openEdit, handleSubmit, handleDelete,
  };
};
