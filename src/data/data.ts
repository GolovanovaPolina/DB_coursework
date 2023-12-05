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
