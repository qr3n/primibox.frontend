import { api } from "@shared/api";
import { DisableNotificationsRequest, EnableNotificationsRequest } from "@shared/api/services/notifications/types";

class NotificationService {
    async enableNotifications(data: EnableNotificationsRequest) {
        return await api.post('/notifications/user/enable', data)
    }

    async disableNotifications(data: DisableNotificationsRequest) {
        return await api.post('/notifications/user/disable', data)
    }
}

export const notificationsService = new NotificationService()
