import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const uploadDocument = async (file, token) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await API.post("/documents/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const analyzeDocument = async (documentId, token) => {
  const response = await API.post(
    "/predict",
    {
      document_id: documentId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
