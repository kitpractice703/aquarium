/** 후기 API */
import { api } from "./axios";

export const getReviews = async (page = 0, size = 5) => {
  const res = await api.get(`/posts/reviews?page=${page}&size=${size}`);
  return res.data;
};

export const getAllReviews = async () => {
  const res = await api.get("/posts/reviews");
  return res.data;
};

export const createReview = async (data: FormData) => {
  const res = await api.post("/posts/reviews", data);
  return res.data;
};
