import {render, screen, userEvent} from '../../tests/utils/utils'
import {act, waitFor} from "@testing-library/react";
import {http, HttpResponse} from 'msw'
import {setupServer} from 'msw/node'
import Cars from "./Cars";
import {BrowserRouter} from "react-router-dom";
import {cars} from "../../tests/mock/data";

const server = setupServer(
    http.get('/data-service/cars/all', ({request, params, cookies}) => {
        return HttpResponse.json(cars)
    }),
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('Cars ', async () => {
    it('Все компоненты модуля должны присутствовать на странице', async () => {
        await act(async () => render(
            <Cars/>,
            {wrapper: BrowserRouter}
        ))

        expect(screen.getByRole('button', {name: /новый/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /удалить/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /получить/i})).toBeInTheDocument();
        expect(screen.getByText(/номер машины/i)).toBeInTheDocument();
        expect(screen.getByText(/ФИО владельца/)).toBeInTheDocument();
        expect(screen.getByText(/номер бокса/i)).toBeInTheDocument();
        expect(screen.getByText(/дата начала аренды/i)).toBeInTheDocument();
        expect(screen.getByText(/квитанция/i)).toBeInTheDocument();

    })

    it('Выгрузка квитанции по выбранному автомобилю должна быть доступна только при наличии выбранной строки', async () => {
        await act(async () => render(
            <Cars/>,
            {wrapper: BrowserRouter}
        ))

        await userEvent.click(screen.getByRole('button', {name: /получить/i}));
        const menuItem = await screen.findByText('Квитанция на оплату аренды выбранной машины');
        expect(menuItem.closest("a")?.className).toContain("disabled");

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 2000});
        await act(async () => await userEvent.click(screen.getAllByRole('cell')[0]));

        await userEvent.click(screen.getByRole('button', {name: /получить/i}));
        const _menuItem = await screen.findByText('Квитанция на оплату аренды выбранной машины');
        expect(_menuItem.closest("a")?.className).not.toContain("disabled");

    })

})
