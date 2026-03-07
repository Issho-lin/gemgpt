import api from '@/lib/api';

export const getModelProviders = async () => {
    const res = await api.get('/core/ai/model/providers');
    return res.data?.data || res.data;
};

export const getModelList = async () => {
    const res = await api.get('/core/ai/model/list');
    return res.data?.data || res.data;
};

export const toggleModelActive = async (model: string, isActive: boolean) => {
    const res = await api.patch('/core/ai/model/toggle', { model, isActive });
    return res.data?.data || res.data;
};

export const deleteCustomModel = async (id: string) => {
    const res = await api.delete('/core/ai/model/delete', { params: { id } });
    return res.data?.data || res.data;
};

export const putUpdateDefaultModels = async (data: any) => {
    const res = await api.patch('/core/ai/model/default', data);
    return res.data?.data || res.data;
};

