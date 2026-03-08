interface GetTariffResponse {
    price_per_km_rub: number
    extra_cost_places_count: number
    price_per_extra_place_rub: number
    extra_cost_weight_kg: number
    price_per_extra_weight_kg_rub: number
}

type UpdateTariffRequest = GetTariffResponse