import { useEffect, useState } from "react";
import {
  getAdminSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  toggleSchedule,
  getAdminPrograms,
} from "../../../api/adminApi";
import type { AdminSchedule, AdminProgram } from "../../../types/api";
import * as S from "../shared/style";

const EMPTY_FORM = { programId: 0, location: "", startTime: "" };

const Schedules = () => {
  const [schedules, setSchedules] = useState<AdminSchedule[]>([]);
  const [programs, setPrograms] = useState<AdminProgram[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminSchedule | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = () =>
    getAdminSchedules(filterDate || undefined).then(setSchedules).catch(console.error);

  useEffect(() => {
    load();
    getAdminPrograms().then(setPrograms).catch(console.error);
  }, []);

  const filtered = schedules.filter(
    (s) => !filterType || s.programType === filterType
  );

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

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

  return (
    <div>
      <S.PageTitle>공연 일정 관리</S.PageTitle>
      <S.FilterRow>
        <S.Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <S.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">전체 유형</option>
          <option value="PERFORMANCE">공연</option>
          <option value="EXPERIENCE">체험</option>
        </S.Select>
        <S.Btn onClick={load}>조회</S.Btn>
        <S.Btn $variant="primary" onClick={openCreate} style={{ marginLeft: "auto" }}>
          + 일정 추가
        </S.Btn>
      </S.FilterRow>

      <S.Card>
        <S.Table>
          <thead>
            <tr>
              <S.Th>프로그램</S.Th>
              <S.Th>유형</S.Th>
              <S.Th>날짜/시간</S.Th>
              <S.Th>장소</S.Th>
              <S.Th>상태</S.Th>
              <S.Th>액션</S.Th>
            </tr>
          </thead>
          <tbody>
            {!filtered.length ? (
              <S.EmptyRow><td colSpan={6}>일정이 없습니다.</td></S.EmptyRow>
            ) : (
              filtered.map((s) => (
                <S.Tr key={`${s.programType}-${s.id}`}>
                  <S.Td>{s.programTitle}</S.Td>
                  <S.Td>
                    <S.Badge $color={s.programType === "PERFORMANCE" ? "#00d4ff" : "#a29bfe"}>
                      {s.programType === "PERFORMANCE" ? "공연" : "체험"}
                    </S.Badge>
                  </S.Td>
                  <S.Td>{s.startTime}</S.Td>
                  <S.Td>{s.location}</S.Td>
                  <S.Td>
                    <S.Badge $color={s.isClosed ? "#ff4757" : "#2ed573"}>
                      {s.isClosed ? "마감" : "오픈"}
                    </S.Badge>
                  </S.Td>
                  <S.Td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <S.Btn onClick={() => handleToggle(s)}>
                        {s.isClosed ? "오픈" : "마감"}
                      </S.Btn>
                      <S.Btn $variant="warning" onClick={() => openEdit(s)}>수정</S.Btn>
                      <S.Btn $variant="danger" onClick={() => handleDelete(s)}>삭제</S.Btn>
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
            <S.ModalTitle>{editing ? "일정 수정" : "일정 추가"}</S.ModalTitle>
            <S.FormGroup>
              <label>프로그램</label>
              <S.Select
                value={form.programId}
                onChange={(e) => setForm({ ...form, programId: Number(e.target.value) })}
                style={{ width: "100%" }}
                disabled={!!editing}
              >
                <option value={0}>선택</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.type === "PERFORMANCE" ? "공연" : "체험"})
                  </option>
                ))}
              </S.Select>
            </S.FormGroup>
            <S.FormGroup>
              <label>날짜/시간 (yyyy-MM-dd HH:mm)</label>
              <S.Input
                style={{ width: "100%", boxSizing: "border-box" }}
                placeholder="2025-05-15 14:00"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </S.FormGroup>
            <S.FormGroup>
              <label>장소</label>
              <S.Input
                style={{ width: "100%", boxSizing: "border-box" }}
                placeholder="메인홀"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
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

export default Schedules;
