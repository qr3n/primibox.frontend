import { DriverApiResponse, Feedback, ProcessedDriverData, Review } from './types';

export const processDriverData = (data?: DriverApiResponse): ProcessedDriverData => {
    if (!data) {
        return getDefaultDriverData();
    }

    return {
        firstName: data.profile.surname || 'Инкогнито',
        lastName: data.profile.name || '',
        rating: 4.8, // Это можно вычислить из feedbacks
        totalRides: data.feedbacks?.length || 0,
        experienceYears: 1, // Это должно приходить из API
        phone: data.profile.phone || 'Еще не задан',
        car: data.car ? {
            brand: data.car.brand || "Toyota",
            model: data.car.model || "Camry",
            year: data.car.year || 2020,
            color: data.car.color || "Серебристый",
            plateNumber: data.car.plateNumber || "А123БВ77"
        } : {
            brand: "Не указана",
            model: "",
            year: 'Не указан',
            color: "Не указан",
            plateNumber: "Не указан"
        },
        reviews: processReviews(data.feedbacks || [])
    };
};

const processReviews = (feedbacks?: Feedback[]): Review[] => {
    return (feedbacks || []).map(feedback => ({
        id: feedback.id,
        userName: "Мария К.", // Это должно приходить из API
        rating: feedback.stars,
        comment: feedback.comment,
        date: "2 дня назад" // Это нужно вычислить из timestamp
    }));
};

const getDefaultDriverData = (): ProcessedDriverData => ({
    firstName: 'Инкогнито',
    lastName: '',
    rating: 0,
    totalRides: 0,
    experienceYears: 0,
    phone: 'Еще не задан',
    car: {
        brand: "Не указана",
        model: "",
        year: 'Не указан',
        color: "Не указан",
        plateNumber: "Не указан"
    },
    reviews: []
});