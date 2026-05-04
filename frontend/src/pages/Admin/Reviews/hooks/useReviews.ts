import { useEffect, useState } from "react";
import { getAdminReviews, deleteReview } from "../../../../api/adminApi";
import type { AdminReview } from "../../../../types/api";

export const useReviews = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [detail, setDetail] = useState<AdminReview | null>(null);

  const load = () => getAdminReviews().then(setReviews).catch(console.error);

  useEffect(() => { load(); }, []);

  const handleDelete = async (r: AdminReview) => {
    if (!confirm(`[${r.title}] 후기를 삭제하시겠습니까?`)) return;
    await deleteReview(r.id);
    setDetail(null);
    load();
  };

  const stars = (rating: number) =>
    "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

  return { reviews, detail, setDetail, handleDelete, stars };
};
