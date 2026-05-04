import { useEffect, useState } from "react";
import { getDashboardStats } from "../../../../api/adminApi";
import type { DashboardStats } from "../../../../types/api";

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.error);
  }, []);

  const stars = (rating: number) =>
    "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

  return { stats, stars };
};
