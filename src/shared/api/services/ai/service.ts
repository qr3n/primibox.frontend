import { CountItemsByAiRequest, CountItemsByAiResponse } from "@shared/api/services/ai/types";
import { withAxiosData } from "@shared/api/utils";
import { api } from "@shared/api";

class AiService {
    async countItems(data: CountItemsByAiRequest) {
        const formData = new FormData()

        formData.append('file', data.image)

        return withAxiosData<CountItemsByAiResponse>(await api.post('/ai/items/count', formData))
    }
}

export const aiService = new AiService()