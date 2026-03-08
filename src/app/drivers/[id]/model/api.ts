// shared/api/driver.ts
import { API_URL } from "@shared/api/config";

interface DriverProfileResponse {
    profile: {
        surname: string;
        name: string;
        phone: string;
        driver_id: string;
    };
    feedbacks?: Array<{
        id: string;
        stars: number;
        comment: string;
    }>;
    car?: {
        brand: string;
        model: string;
        year: string | number;
        color: string;
        number: string;
    };
}

export const fetchDriverProfile = async (id: string): Promise<DriverData> => {
    const res = await fetch(`${API_URL}/driver/profile/${id}`);
    if (!res.ok) throw new Error('Failed to fetch driver profile');

    const data: DriverProfileResponse = await res.json();


    return {
        firstName: data.profile.surname || 'Инкогнито',
        lastName: data.profile.name || '',
        rating: calculateAverageRating(data.feedbacks) || 4.8,
        totalRides: data.feedbacks?.length || 0,
        driverId: data.profile.driver_id || '',
        phone: data.profile.phone || 'Еще не задан',
        car: data.car ? {
            brand: data.car.brand || "Не указана",
            model: data.car.model || "",
            year: data.car.year || 'Не указан',
            color: data.car.color || "Не указан",
            plateNumber: data.car.number || "Не указан"
        } : {
            brand: "Не указана",
            model: "",
            year: 'Не указан',
            color: "Не указан",
            plateNumber: "Не указан"
        },
        reviews: (data.feedbacks || []).map(feedback => ({
            id: feedback.id,
            userName: "Аноним",
            rating: feedback.stars,
            comment: feedback.comment,
            date: "Недавно"
        }))
    };
};

function calculateAverageRating(feedbacks?: Array<{stars: number}>): number {
    if (!feedbacks || feedbacks.length === 0) return 4.8;
    const sum = feedbacks.reduce((acc, curr) => acc + curr.stars, 0);
    return parseFloat((sum / feedbacks.length).toFixed(1));
}

interface DriverData {
    firstName: string;
    lastName: string;
    rating: number;
    totalRides: number;
    driverId: string;
    phone: string;
    car: CarData;
    reviews: Review[];
}

interface CarData {
    brand: string;
    model: string;
    year: string | number;
    color: string;
    plateNumber: string;
}

interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}