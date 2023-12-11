import {render, screen, userEvent} from '../../utils/utils'
import {act, waitFor} from "@testing-library/react";
import {http, HttpResponse} from 'msw'
import {setupServer} from 'msw/node'
import {boxes, models, renters} from "./mock/mock";
import NewRent from "./NewRent";

interface IField {
    name: string,
    required: boolean
}

const fields: IField[] = [
    {
        name: "Клиент",
        required: true
    },
    {
        name: "Телефон",
        required: true
    },
    {
        name: "Адрес",
        required: false
    },
    {
        name: "Модель",
        required: true
    },
    {
        name: "Номер машины",
        required: true
    },
    {
        name: "Регион",
        required: true
    },
]

const server = setupServer(
    http.get('/data-service/boxes/freeWithModel/:id', ({request, params, cookies}) => {
        return HttpResponse.json(boxes)
    }),
    http.get("/data-service/models/all", ({request, params, cookies}) => {
        return HttpResponse.json(models)
    }),
    http.get("/data-service/renters/all", ({request, params, cookies}) => {
        return HttpResponse.json(renters)
    })
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('New rent ', async () => {
    it('Все поля формы должны отображаться на странице', async () => {
        await act(async () => render(
            <NewRent/>
        ))

        for (let field of fields) {
            expect(screen.getByLabelText(new RegExp(field.name))).toBeInTheDocument();
        }

    })

    it('Поля с данными о клиенте должны быть заполнены после выбора клиента из списка', async () => {
        await act(async () => render(
            <NewRent/>
        ))

        await userEvent.type(screen.getByLabelText(/Клиент/), renters[0].full_name.substring(0, 5));
        await waitFor(() => {
            screen.getByText(renters[0].full_name);
        })
        await userEvent.click(screen.getByText(renters[0].full_name));
        const phone = (screen.getByLabelText(/Телефон/) as HTMLInputElement).value;
        expect(phone.replace("(", "").replace(")", "").replace("-", "").replace(" ", "")).toBe(renters[0].phone);
        expect((screen.getByLabelText(/Адрес/) as HTMLInputElement).value).toBe(renters[0].address);
    })

    it('Поля с данными о клиенте должны быть доступны для заполнения вручную при создании нового клиента', async () => {
        await act(async () => render(
            <NewRent/>
        ))

        await userEvent.type(screen.getByLabelText(/клиент/i), "Абракадабра Абракадабровна{Enter}");
        expect(screen.getByText("Абракадабра Абракадабровна")).toBeInTheDocument();

        await userEvent.click(screen.getByLabelText(/телефон/i));
        const phone = (screen.getByLabelText(/Телефон/) as HTMLInputElement).value;
        expect(phone).toBe("+_(___) ___-____");

        expect(screen.getByLabelText(/адрес/i)).not.toBeDisabled();
    })

    it('Должно открываться модальное окно выбора бокса при корректном заполнении полей и отправке формы', async () => {
        await act(async () => render(
            <NewRent/>
        ))

        await userEvent.type(screen.getByLabelText(/клиент/i), "Абракадабра Абракадабровна{Enter}");
        await userEvent.type(screen.getByLabelText(/телефон/i), "79019902030");
        await userEvent.type(screen.getByLabelText(/адрес/i), "какой-то адрес");
        await userEvent.type(screen.getByLabelText(/модель/i), "ford{Enter}");
        await userEvent.type(screen.getByLabelText(/номер машины/i), "РК302А");
        await userEvent.type(screen.getByLabelText(/регион/i), "76");

        await userEvent.click(screen.getAllByText(/подобрать/i)[0]);
        expect(screen.queryByText(/некорректное значение/i)).toBe(null);
        expect(screen.queryByText(/введите значение/i)).toBe(null);
        expect(await screen.findByRole("dialog")).toBeInTheDocument();

    })

    it('Должно появляться сообщение об ошибке при некорректном заполнении поля', async () => {
        await act(async () => render(
            <NewRent/>
        ))

        await userEvent.type(screen.getByLabelText(/клиент/i), "Абракадабра Абракадабровна");

        await waitFor(() => {
            screen.getAllByText(/добавить/i);
        })

        await userEvent.click(screen.getAllByText(/добавить/i)[0]);

        // некорректный номер телефона
        await userEvent.type(screen.getByLabelText(/телефон/i), "777");
        // ушли с поля
        await userEvent.click(screen.getByLabelText(/адрес/i));

        expect(screen.getByText(/некорректное значение/i)).toBeInTheDocument();
    })

    it('Должно появляться сообщение об ошибке рядом с каждым обязательным полем (ни одно из полей не заполнено)', async () => {
        await act(async () => render(
            <NewRent/>
        ))

        await userEvent.click(screen.getByText(/подобрать/i));
        expect((await screen.findAllByText("Введите значение")).length).toBe(fields.filter(value => value.required).length);

    })

    it('Должно появляться сообщение об ошибке рядом с каждым незаполненным обязательным полем (заполнены не все поля)', async () => {
        await act(async () => render(
            <NewRent/>
        ))

        await userEvent.type(screen.getByLabelText(/Клиент/), renters[0].full_name.substring(0, 5));
        await waitFor(() => {
            screen.getByText(renters[0].full_name);
        })
        await userEvent.click(screen.getByText(renters[0].full_name));

        await userEvent.click(screen.getByText(/Подобрать/));
        expect((await screen.findAllByText("Введите значение")).length).toBeGreaterThan(0);

    })

})
