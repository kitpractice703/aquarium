import { useEffect, useState } from "react";
import { getAdminPrograms, createProgram, updateProgram, deleteProgram } from "../../../api/adminApi";
import type { AdminProgram, AdminProgramRequest } from "../../../types/api";
import * as S from "../shared/style";

const EMPTY_FORM: AdminProgramRequest = { title: "", description: "", type: "PERFORMANCE", price: 0 };

const Programs = () => {
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

  return (
    <div>
      <S.PageTitle>프로그램 관리</S.PageTitle>
      <S.FilterRow>
        <S.Btn $variant="primary" onClick={openCreate} style={{ marginLeft: "auto" }}>
          + 프로그램 추가
        </S.Btn>
      </S.FilterRow>

      <S.Card>
        <S.Table>
          <thead>
            <tr>
              <S.Th>프로그램명</S.Th>
              <S.Th>유형</S.Th>
              <S.Th>가격</S.Th>
              <S.Th>설명</S.Th>
              <S.Th>액션</S.Th>
            </tr>
          </thead>
          <tbody>
            {!programs.length ? (
              <S.EmptyRow><td colSpan={5}>프로그램이 없습니다.</td></S.EmptyRow>
            ) : (
              programs.map((p) => (
                <S.Tr key={p.id}>
                  <S.Td>{p.title}</S.Td>
                  <S.Td>
                    <S.Badge $color={p.type === "PERFORMANCE" ? "#00d4ff" : "#a29bfe"}>
                      {p.type === "PERFORMANCE" ? "공연" : "체험"}
                    </S.Badge>
                  </S.Td>
                  <S.Td>₩{p.price.toLocaleString()}</S.Td>
                  <S.Td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.description}
                  </S.Td>
                  <S.Td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <S.Btn $variant="warning" onClick={() => openEdit(p)}>수정</S.Btn>
                      <S.Btn $variant="danger" onClick={() => handleDelete(p)}>삭제</S.Btn>
                    </div>
                  </S.Td>
                </S.Tr>
              ))
            )}
          </tbody>
        </S.Table>
      </S.Card>

      {modalOpen && (
        <S.Overlay>
          <S.Modal>
            <S.ModalTitle>{editing ? "프로그램 수정" : "프로그램 추가"}</S.ModalTitle>
            <S.FormGroup>
              <label>프로그램명</label>
              <S.Input style={{ width: "100%", boxSizing: "border-box" }} value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </S.FormGroup>
            <S.FormGroup>
              <label>유형</label>
              <S.Select style={{ width: "100%" }} value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="PERFORMANCE">공연</option>
                <option value="EXPERIENCE">체험</option>
              </S.Select>
            </S.FormGroup>
            <S.FormGroup>
              <label>가격 (원)</label>
              <S.Input type="number" style={{ width: "100%", boxSizing: "border-box" }} value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </S.FormGroup>
            <S.FormGroup>
              <label>설명</label>
              <S.Textarea value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </S.FormGroup>
            <S.ModalActions>
              <S.Btn onClick={() => setModalOpen(false)}>취소</S.Btn>
              <S.Btn $variant="primary" onClick={handleSubmit}>저장</S.Btn>
            </S.ModalActions>
          </S.Modal>
        </S.Overlay>
      )}
    </div>
  );
};

export default Programs;
