import { useEffect, useState } from "react";
import { getAdminExhibitions, createExhibition, updateExhibition, deleteExhibition } from "../../../../api/adminApi";
import type { AdminExhibition, AdminExhibitionRequest } from "../../../../types/api";

const EMPTY_FORM: AdminExhibitionRequest = { title: "", subTitle: "", description: "", themeColor: "#1a2a4a" };

export const useExhibitions = () => {
  const [exhibitions, setExhibitions] = useState<AdminExhibition[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminExhibition | null>(null);
  const [form, setForm] = useState<AdminExhibitionRequest>(EMPTY_FORM);

  const load = () => getAdminExhibitions().then(setExhibitions).catch(console.error);

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };

  const openEdit = (e: AdminExhibition) => {
    setEditing(e);
    setForm({
      title: e.title,
      subTitle: e.subTitle ?? "",
      description: e.description ?? "",
      themeColor: e.themeColor ?? "#1a2a4a",
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title) { alert("전시명을 입력해주세요."); return; }
    try {
      if (editing) { await updateExhibition(editing.id, form); }
      else { await createExhibition(form); }
      setModalOpen(false);
      load();
    } catch { alert("저장에 실패했습니다."); }
  };

  const handleDelete = async (e: AdminExhibition) => {
    if (!confirm(`[${e.title}] 전시를 삭제하시겠습니까?`)) return;
    await deleteExhibition(e.id);
    load();
  };

  return {
    exhibitions, modalOpen, setModalOpen, editing, form, setForm,
    openCreate, openEdit, handleSubmit, handleDelete,
  };
};
