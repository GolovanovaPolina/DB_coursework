export type Car = {
    car_number: number;
    automobile_number: string;
    box_number: number;
    receipt_number: number;
    rental_start_date: string;
    id_renter: number | null;
    id_model: number | null;
}

export type Model = {
    id_model: number;
    name: string;
}

export type Box = {
    box_number: number;
    id_model: number;
    model_name: string;
    daily_cost: number;
}

export type Renter = {
    id_renter: number;
    full_name: string;
    phone: string;
    address: string;
}