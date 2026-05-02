import { useEffect, useState } from "react";
import { getAdminExhibitions, createExhibition, updateExhibition, deleteExhibition } from "../../../api/adminApi";
import type { AdminExhibition, AdminExhibitionRequest } from "../../../types/api";
import * as S from "../shared/style";

const EMPTY_FORM: AdminExhibitionRequest = { title: "", subTitle: "", description: "", themeColor: "#1a2a4a" };

const Exhibitions = () => {
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

  return (
    <div>
      <S.PageTitle>전시 관리</S.PageTitle>
      <S.FilterRow>
        <S.Btn $variant="primary" onClick={openCreate} style={{ marginLeft: "auto" }}>
          + 전시 추가
        </S.Btn>
      </S.FilterRow>

      <S.Card>
        <S.Table>
          <thead>
            <tr>
              <S.Th>전시명</S.Th>
              <S.Th>부제</S.Th>
              <S.Th>테마색</S.Th>
              <S.Th>설명</S.Th>
              <S.Th>액션</S.Th>
            </tr>
          </thead>
          <tbody>
            {!exhibitions.length ? (
              <S.EmptyRow><td colSpan={5}>전시가 없습니다.</td></S.EmptyRow>
            ) : (
              exhibitions.map((e) => (
                <S.Tr key={e.id}>
                  <S.Td>{e.title}</S.Td>
                  <S.Td style={{ color: "#8aacc8" }}>{e.subTitle ?? "-"}</S.Td>
                  <S.Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 4,
                        background: e.themeColor ?? "#1a2a4a",
                        border: "1px solid #1a2f52",
                      }} />
                      <span style={{ fontSize: 11, color: "#5a7a9a" }}>{e.themeColor}</span>
                    </div>
                  </S.Td>
                  <S.Td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {e.description ?? "-"}
                  </S.Td>
                  <S.Td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <S.Btn $variant="warning" onClick={() => openEdit(e)}>수정</S.Btn>
                      <S.Btn $variant="danger" onClick={() => handleDelete(e)}>삭제</S.Btn>
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
            <S.ModalTitle>{editing ? "전시 수정" : "전시 추가"}</S.ModalTitle>
            <S.FormGroup>
              <label>전시명</label>
              <S.Input style={{ width: "100%", boxSizing: "border-box" }} value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </S.FormGroup>
            <S.FormGroup>
              <label>부제</label>
              <S.Input style={{ width: "100%", boxSizing: "border-box" }} value={form.subTitle}
                onChange={(e) => setForm({ ...form, subTitle: e.target.value })} />
            </S.FormGroup>
            <S.FormGroup>
              <label>테마 색상</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="color" value={form.themeColor}
                  onChange={(e) => setForm({ ...form, themeColor: e.target.value })}
                  style={{ width: 40, height: 36, border: "none", background: "none", cursor: "pointer" }} />
                <S.Input value={form.themeColor}
                  onChange={(e) => setForm({ ...form, themeColor: e.target.value })}
                  style={{ width: 120 }} />
              </div>
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

export default Exhibitions;
