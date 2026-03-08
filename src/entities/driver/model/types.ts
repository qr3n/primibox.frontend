export interface DriverProfile {
    driver_id: string;
    surname: string;
    name: string;
    phone?: string;
}

export interface CarData {
    brand: string;
    model: string;
    year: string | number;
    color: string;
    plateNumber: string;
}

export interface Feedback {
    id: string | number;
    stars: number;
    comment: string;
}

export interface Review {
    id: string | number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface DriverApiResponse {
    profile: DriverProfile;
    car?: CarData;
    feedbacks?: Feedback[];
}

export interface ProcessedDriverData {
    firstName: string;
    lastName: string;
    rating: number;
    totalRides: number;
    experienceYears: number;
    phone: string;
    car: CarData;
    reviews: Review[];
}