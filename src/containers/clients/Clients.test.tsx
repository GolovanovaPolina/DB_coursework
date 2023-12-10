import {render, screen, userEvent} from '../../utils/utils'
import {act, waitFor} from "@testing-library/react";
import {http, HttpResponse} from 'msw'
import {setupServer} from 'msw/node'
import {renters} from "./mock/mock";
import Clients from "./Clients";

const server = setupServer(
    http.get('/data-service/renters/all', ({request, params, cookies}) => {
        return HttpResponse.json(renters)
    }),
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('Boxes ', async () => {
    it('Все компоненты модуля должны присутствовать на странице', async () => {
        await act(async () => render(
            <Clients/>
        ))

        expect(screen.getByRole('button', {name: /редактировать/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /получить/i})).toBeInTheDocument();
        expect(screen.getByText('ФИО')).toBeInTheDocument();
        expect(screen.getByText('Телефон')).toBeInTheDocument();
        expect(screen.getByText('Адрес')).toBeInTheDocument();

    })

    it('Кнопка редактирования должна быть активна только при наличии выбранной строки', async () => {
        await act(async () => render(
            <Clients/>
        ))

        expect(screen.getByRole('button', {name: /редактировать/i})).toBeDisabled();

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 1500});

        const cells = await screen.findAllByRole("cell");


        await cells[0].click();
        expect(screen.getByRole('button', {name: /редактировать/i})).not.toBeDisabled();
        await cells[0].click();
        expect(screen.getByRole('button', {name: /редактировать/i})).toBeDisabled();

    })


    it('Модальное окно редактирования должно открываться по клику на кнопку изменения и содержать данные о выбранном клиенте', async () => {
        await act(async () => render(
            <Clients/>
        ))

        const btn = screen.getByRole('button', {name: /редактировать/i});
        await act(async () => btn.click());

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 1500});
        const cells = await screen.findAllByRole("cell");

        const values = {
            name: "",
            phone: "",
            addr: ""
        };
        values.name = cells[0].innerHTML;
        values.phone = cells[1].innerHTML;
        values.addr = cells[2].innerHTML;

        await cells[0].click();
        await btn.click();

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText(/редактирование данных о клиенте/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/ФИО/i).innerHTML).toBe(values.name);
        expect(screen.getByLabelText(/телефон/i).innerHTML).toBe(values.phone);
        expect(screen.getByLabelText(/адрес/i).innerHTML).toBe(values.addr);


    })

    it('Данные в таблице должны быть обновлены после отправки формы редактирования данных о клиенте', async () => {
        await act(async () => render(
            <Clients/>
        ))

        const btn = screen.getByRole('button', {name: /редактировать/i});
        await act(async () => btn.click());

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 1500});
        const cells = await screen.findAllByRole("cell");
        const name = "Голованова П.Д.";
        const phone = "+79809008070";
        const addr = cells[2].innerHTML;

        await cells[0].click();
        await btn.click();

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
        await userEvent.type(screen.getByLabelText(/ФИО/i), name)
        await userEvent.type(screen.getByLabelText(/телефон/i), phone)
        await userEvent.click(screen.getByText(/отправить/i))

        expect(await screen.findByText(/успешно/i)).toBeInTheDocument();

        const _cells = await screen.findAllByRole("cell");
        expect(_cells.length).toBeGreaterThan(0);
        expect(_cells[0].innerHTML).toBe(name);
        expect(_cells[1].innerHTML).toBe(phone);
        expect(_cells[2].innerHTML).toBe(addr);

    })


})
