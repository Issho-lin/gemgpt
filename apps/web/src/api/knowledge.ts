import api from '@/lib/api';

export type CreateGeneralKnowledgeBody = {
  name: string;
  intro?: string;
  avatar?: string;
  vectorModel?: string;
  agentModel?: string;
  vlmModel?: string;
};

export type UpdateKnowledgeBody = {
  name?: string;
  description?: string;
  avatar?: string;
  config?: Record<string, any>;
};

export type KnowledgeBaseItem = {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  config?: any;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    documents?: number;
  };
};

export const createGeneralKnowledge = async (data: CreateGeneralKnowledgeBody) => {
  const res = await api.post('/knowledge-bases/general', data);
  return res.data?.data || res.data;
};

export type KnowledgeDocumentItem = {
  id: string;
  filename: string;
  fileType?: string;
  status?: string;
  createdAt?: string;
};

export type KnowledgeDetailItem = KnowledgeBaseItem & {
  documents?: KnowledgeDocumentItem[];
};

export const getKnowledgeList = async () => {
  const res = await api.get('/knowledge-bases');
  return (res.data?.data || res.data || []) as KnowledgeBaseItem[];
};

export const getKnowledgeDetail = async (id: string) => {
  const res = await api.get(`/knowledge-bases/${id}`);
  return (res.data?.data || res.data) as KnowledgeDetailItem;
};

export const updateKnowledge = async (id: string, data: UpdateKnowledgeBody) => {
  const res = await api.patch(`/knowledge-bases/${id}`, data);
  return res.data?.data || res.data;
};

export const deleteKnowledge = async (id: string) => {
  const res = await api.delete(`/knowledge-bases/${id}`);
  return res.data?.data || res.data;
};
