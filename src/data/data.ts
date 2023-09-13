import {IChartElement} from "../types/types";

export const boxTableColumns = [
    {
        Header: "Номер бокса",
        accessor: "box_number",
    },
    {
        Header: "Поддерживаемая марка",
        accessor: "model_name",
    },
    {
        Header: "Стоимость (руб / сутки)",
        accessor: "daily_cost",
    },
];

export const clientsTableColumns = [
    {
        Header: "ФИО",
        accessor: "full_name",
    },
    {
        Header: "Телефон",
        accessor: "phone",
    },
    {
        Header: "Адрес",
        accessor: "address",
    },
];

export const carsTableColumns = [
    {
        Header: "Номер машины",
        accessor: "automobile_number",
    },
    {
        Header: "ФИО владельца",
        accessor: "renter_full_name",
    },
    {
        Header: "Номер бокса",
        accessor: "box_number",
    },
    {
        Header: "Дата начала аренды",
        accessor: "rental_start_date",
    },
    {
        Header: "Квитанция",
        accessor: "receipt_number",
    },
];
export const chartData: IChartElement[] = [
    {
        model_name: "Opel",
        count_box: 10,
        count_car: 6,
    },
    {
        model_name: "Volvo",
        count_box: 3,
        count_car: 1,
    },
    {
        model_name: "Ford",
        count_box: 10,
        count_car: 3,
    },
    {
        model_name: "Kia",
        count_box: 15,
        count_car: 12,
    },
    {
        model_name: "Lada",
        count_box: 18,
        count_car: 10,
    },
];

// 56
// 32
