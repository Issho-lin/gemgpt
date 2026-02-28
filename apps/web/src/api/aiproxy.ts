import api from '@/lib/api';

export const getChannelList = async () => {
    const res = await api.get('/core/aiproxy/channels/all', { params: { page: 1, perPage: 100 } });
    if (res.data && Array.isArray(res.data)) {
        res.data.sort((a, b) => {
            if (a.status !== b.status) {
                return a.status - b.status;
            }
            return b.priority - a.priority;
        });
        return res.data;
    }
    return [];
};

export const getChannelProviders = async () => {
    const res = await api.get('/core/aiproxy/channels/type_metas');
    return res.data || {};
};

export const postCreateChannel = async (data: any) => {
    const res = await api.post('/core/aiproxy/createChannel', {
        type: data.type,
        name: data.name,
        base_url: data.base_url,
        models: data.models,
        model_mapping: data.model_mapping,
        key: data.key,
        priority: 1
    });
    return res.data;
};

export const putChannelStatus = async (id: number, status: number) => {
    const res = await api.post(`/core/aiproxy/channel/${id}/status`, { status });
    return res.data;
};

export const putChannel = async (data: any) => {
    const res = await api.put(`/core/aiproxy/channel/${data.id}`, {
        type: data.type,
        name: data.name,
        base_url: data.base_url,
        models: data.models,
        model_mapping: data.model_mapping,
        key: data.key,
        status: data.status,
        priority: data.priority ? Math.max(data.priority, 1) : undefined
    });
    return res.data;
};

export const deleteChannel = async (id: number) => {
    const res = await api.delete(`/core/aiproxy/channel/${id}`);
    return res.data;
};
