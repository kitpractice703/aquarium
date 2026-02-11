import { useState, useEffect } from "react";
import { api } from "../../../api/axios";

export interface ProgramData {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export const useProgramList = () => {
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await api.get<ProgramData[]>("/programs");
        setPrograms(response.data);
      } catch (error) {
        console.error("프로그램 목록을 불러오지 못했습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return { programs, loading };
};
