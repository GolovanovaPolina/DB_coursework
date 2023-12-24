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

    it('Форма редактирования должна быть отправлена, если во все поля введены корректные данные', async () => {
        await act(async () => render(
            <Clients/>
        ))

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 2000});
        await userEvent.click(await screen.getAllByRole("cell")[0]);
        await userEvent.click(screen.getByRole('button', {name: /редактировать/i}));

        await waitFor(() => screen.getByRole("dialog"));

        await userEvent.type(screen.getByLabelText(/ФИО/i), "Васильев В.В.");
        await userEvent.type(screen.getByLabelText(/телефон/i), "79109967788");
        await userEvent.type(screen.getByLabelText(/адрес/i), "ул. Гражданская, д.21");
        await userEvent.click(screen.getByRole('button', {name: /отправить/i}));

        expect(screen.queryByText(/некорректное значение/i)).toBeNull();
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(screen.queryByText(/успешно/i)).toBeInTheDocument();
    })
})
