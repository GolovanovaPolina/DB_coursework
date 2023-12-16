import {render, screen, userEvent} from '../../tests/utils/utils'
import {act, waitFor} from "@testing-library/react";
import {http, HttpResponse} from 'msw'
import {setupServer} from 'msw/node'
import Clients from "./Clients";
import {RentersMockData} from "./mock/mock";

const mock = new RentersMockData();

const server = setupServer(
    http.get('/data-service/renters/all', ({request, params, cookies}) => {
        return HttpResponse.json(mock.renters)
    }),
    http.post('/data-service/renters/update', async ({request, params, cookies}) => {
        if (!request.body) return;

        const readableStream = request.body.pipeThrough(new TextDecoderStream("utf-8"));
        let str = "";
        // @ts-ignore
        for await (const stringChunk of readableStream) {
            str += stringChunk;
        }

        mock.updateRenter(JSON.parse(str));
        return HttpResponse.json()

    })
)

beforeAll(() => server.listen({
    onUnhandledRequest: "error",
}))

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('Clients ', async () => {
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

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 2000});
        const cell = (await screen.findAllByRole("cell"))[0];
        await userEvent.click(cell);
        expect(screen.getByRole('button', {name: /редактировать/i})).not.toBeDisabled();
        await userEvent.click(cell);
        expect(screen.getByRole('button', {name: /редактировать/i})).toBeDisabled();
    })


    it('Модальное окно редактирования должно открываться по клику на кнопку изменения и содержать данные о выбранном клиенте', async () => {
        await act(async () => render(
            <Clients/>
        ))

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 2000});
        const cells = await screen.getAllByRole("cell");
        const values = cells.map(cell => cell.innerHTML);

        await userEvent.click(cells[0]);
        await userEvent.click(screen.getByRole('button', {name: /редактировать/i}));

        await waitFor(() => screen.getByRole("dialog"));

        expect(screen.getByText(/редактирование данных о клиенте/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/ФИО/i).innerHTML).toBe(values[0]);
        expect(screen.getByLabelText(/телефон/i).innerHTML).toBe(values[1]);
        expect(screen.getByLabelText(/адрес/i).innerHTML).toBe(values[2]);
    })

    it('Данные в таблице должны быть обновлены после отправки формы редактирования данных о клиенте', async () => {
        await act(async () => render(
            <Clients/>
        ))

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 2000});
        const cells = await screen.findAllByRole("cell");

        const name = "Голованова П.Д.";
        const phone = "+79809008070";
        const addr = cells[2].innerHTML;

        await userEvent.click(cells[0]);
        await userEvent.click(screen.getByRole('button', {name: /редактировать/i}));

        await waitFor(() => screen.getByRole("dialog"));
        await userEvent.type(screen.getByLabelText(/ФИО/i), name)
        await userEvent.type(screen.getByLabelText(/телефон/i), phone)
        await userEvent.click(screen.getByText(/отправить/i));

        const _cells = await screen.findAllByRole("cell");
        expect(_cells[0].innerHTML).toBe(name);
        expect(_cells[1].innerHTML).toBe(phone);
        expect(_cells[2].innerHTML).toBe(addr);
    })

    it('Форма редактирования не должна быть отправлена, если хотя бы в одно из полей введены некорректные данные', async () => {
        await act(async () => render(
            <Clients/>
        ))

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 2000});
        await userEvent.click(await screen.getAllByRole("cell")[0]);
        await userEvent.click(screen.getByRole('button', {name: /редактировать/i}));

        await waitFor(() => screen.getByRole("dialog"));

        await userEvent.type(screen.getByLabelText(/ФИО/i), "Васильев В.В.");
        await userEvent.type(screen.getByLabelText(/телефон/i), "666");
        await userEvent.type(screen.getByLabelText(/адрес/i), "ул. Гражданская, д.21");

        expect(screen.getByText(/некорректное значение/i));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    })


})
