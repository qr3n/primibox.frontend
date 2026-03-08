export interface CountItemsByAiRequest {
    image: File
}

export interface CountItemsByAiResponse {
    count: number,
    average_weight_kg: number,
    dimensions_cm: {
        length: number,
        width: number,
        height: number
    }
}