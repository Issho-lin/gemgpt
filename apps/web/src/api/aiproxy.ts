import api from '@/lib/api';

export const getChannelList = async () => {
    const res = await api.get('/core/aiproxy/channels/all', { params: { page: 1, perPage: 100 } });
    const channelList = res.data?.data || res.data;
    if (channelList && Array.isArray(channelList)) {
        channelList.sort((a: any, b: any) => {
            if (a.status !== b.status) {
                return a.status - b.status;
            }
            return b.priority - a.priority;
        });
        return channelList;
    }
    return [];
};

export const getChannelProviders = async () => {
    const res = await api.get('/core/aiproxy/channels/type_metas');
    return res.data?.data || res.data || {};
};

export const getAiproxyMap = async () => {
    const res = await api.get('/core/ai/model/aiproxyMap');
    return res.data?.data || res.data || {};
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
    return res.data?.data || res.data;
};

export const putChannelStatus = async (id: number, status: number) => {
    const res = await api.post(`/core/aiproxy/channel/${id}/status`, { status });
    return res.data?.data || res.data;
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
    return res.data?.data || res.data;
};

export const deleteChannel = async (id: number) => {
    const res = await api.delete(`/core/aiproxy/channel/${id}`);
    return res.data?.data || res.data;
};

export const getTestModel = async (channelId: number, model?: string) => {
    const res = await api.get('/core/ai/model/test', { params: { model, channelId } });
    return res.data?.data || res.data;
};
