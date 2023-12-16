import {render, screen, userEvent} from '../../tests/utils/utils'
import Boxes from "./Boxes";
import {act, waitFor} from "@testing-library/react";
import {http, HttpResponse} from 'msw'
import {setupServer} from 'msw/node'
import {boxes, models} from "../../tests/mock/data";

const server = setupServer(
    http.get('/data-service/boxes/all', ({request, params, cookies}) => {
        return HttpResponse.json(boxes)
    }),
    http.get("/data-service/models/all", ({request, params, cookies}) => {
        return HttpResponse.json(models)
    })
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('Boxes ', async () => {
    it('Все компоненты модуля должны присутствовать на странице', async () => {
        await act(async () => render(
            <Boxes/>
        ))

        expect(screen.getByText(/номер бокса/i)).toBeInTheDocument();
        expect(screen.getByText(/поддерживаемая марка/i)).toBeInTheDocument();
        expect(screen.getByText(/стоимость \(руб \/ сутки\)/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /добавить/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /удалить/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /изменить/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /получить/i})).toBeInTheDocument();

    })

    it('Кнопка удаления должна быть активна только при наличии выбранной строки', async () => {
        await act(async () => render(
            <Boxes/>
        ))

        expect(screen.getByRole('button', {name: /удалить/i})).toBeDisabled();

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 2000});
        const cell = (await screen.findAllByRole("cell"))[0];

        await userEvent.click(cell);
        expect(screen.getByRole('button', {name: /удалить/i})).not.toBeDisabled();
        await userEvent.click(cell);
        expect(screen.getByRole('button', {name: /удалить/i})).toBeDisabled();

    })

    it('Модальное окно добавления должно открываться по клику на кнопку добавления', async () => {
        await act(async () => render(
            <Boxes/>
        ))

        await userEvent.click(screen.getByRole('button', {name: /добавить/i}));

        await waitFor(() => screen.getByRole("dialog"));
        expect(screen.getByLabelText(/номер бокса/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/модель/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/стоимость аренды/i)).toBeInTheDocument();
    })

    it('Модальное окно изменения стоимости должно открываться по клику на кнопку изменения', async () => {
        await act(async () => render(
            <Boxes/>
        ))

        await userEvent.click(screen.getByRole('button', {name: /изменить/i}));

        await waitFor(() => screen.getByRole("dialog"));
        expect(screen.getByLabelText(/коэффициент/i)).toBeInTheDocument();
    })

    it('Данные в таблице о стоимости аренды должны быть обновлены после отправки формы изменения стоимости', async () => {
        await act(async () => render(
            <Boxes/>
        ))

        const k = 1.5;

        const values: number[] = [];
        const headers = screen.getAllByRole("columnheader");
        let index = -1;
        for (let i = 0; i < headers.length; i++) {
            if (headers[i].title.toLowerCase().includes("cтоимость")) {
                index = i;
                break;
            }
        }
        if (index == -1) return;

        const cells = await screen.findAllByRole("cell");
        for (let i = 0; i < cells.length; i++) {
            if (i+1 % index == 0) {
                values.push(Number(cells[i].textContent));
            }
        }

        await userEvent.click(screen.getByRole('button', {name: /изменить/i}));
        await waitFor(() => screen.getByRole("dialog"));

        await userEvent.type(screen.getByLabelText(/коэффициент/i), k.toString());
        await userEvent.click(screen.getByText("Отправить"));

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 2000});
        const _cells = screen.getAllByRole("cell");
        for (let i = 0; i < _cells.length; i++) {
            if (i+1 % index == 0) {
                expect(Number(_cells[i].textContent)).toBe(values[i] * k);
            }
        }

    })
})
