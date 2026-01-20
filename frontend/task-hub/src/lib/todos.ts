import api from "./api";

export const fetchTodos = async () => {
  const res = await api.get("/todos");
  return res.data;
};
