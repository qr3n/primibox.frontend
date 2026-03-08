import { LeaveFeedbackRequest } from "@shared/api/services/feedback/types";
import { api } from "@shared/api";

class FeedbackService {
    async leaveFeedback(data: LeaveFeedbackRequest) {
        return await api.post('/feedback', data)
    }
}

export const feedbackService = new FeedbackService()