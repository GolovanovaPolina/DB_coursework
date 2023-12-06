import {render, screen} from '../../utils/utils'
import Boxes from "./Boxes";
import {act} from "@testing-library/react";
import {http, HttpResponse} from 'msw'
import {setupServer} from 'msw/node'

const server = setupServer(
    http.get('/data-service/boxes/all', ({request, params, cookies}) => {
        return HttpResponse.json([{
            "box_number": 102,
            "id_model": 78019625,
            "daily_cost": 660,
            "model_name": "Opel"
        }, {"box_number": 103, "id_model": 78019625, "daily_cost": 826, "model_name": "Opel"}, {
            "box_number": 105,
            "id_model": 36074306,
            "daily_cost": 936,
            "model_name": "Ford"
        }, {"box_number": 106, "id_model": 911776857, "daily_cost": 660, "model_name": "Kia"}, {
            "box_number": 110,
            "id_model": 765420496,
            "daily_cost": 1100,
            "model_name": "Volvo"
        }, {
            "box_number": 115,
            "id_model": 623580884,
            "daily_cost": 1320,
            "model_name": "Lamborghini"
        }, {"box_number": 120, "id_model": 78019625, "daily_cost": 935, "model_name": "Opel"}, {
            "box_number": 125,
            "id_model": 36074306,
            "daily_cost": 990,
            "model_name": "Ford"
        }, {"box_number": 130, "id_model": 540846179, "daily_cost": 1265, "model_name": "Haval"}, {
            "box_number": 135,
            "id_model": 1477140551,
            "daily_cost": 440,
            "model_name": "Lada"
        }])
    }),
    http.get("/data-service/models/all", ({request, params, cookies}) => {
        return HttpResponse.json([{"id_model": 78019625, "name": "Opel"}, {
            "id_model": 36074306,
            "name": "Ford"
        }, {"id_model": 911776857, "name": "Kia"}, {"id_model": 765420496, "name": "Volvo"}, {
            "id_model": 623580884,
            "name": "Lamborghini"
        }, {"id_model": 1477140551, "name": "Lada"}, {"id_model": 540846179, "name": "Haval"}])
    })
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('Boxes ', async () => {
    it('Кнопка удаления активируется при выборе строки', async () => {
        await act(async () => render(
            <Boxes/>
        ))

        const btn = screen.getByRole('button', {name: /удалить/i});
        expect(btn).toBeDisabled();

        setTimeout(async () => {
            const row = await screen.findByRole("cell");
            await row.click();

            btn.click();
            expect(await screen.findByRole("dialog")).toBeInTheDocument();
        }, 1000)

    })

    it('Открылось модальное окно добавления бокса', async () => {
        await act(async () => render(
            <Boxes/>
        ))

        const btn = screen.getByRole('button', {name: /добавить/i});
        await act(async () => btn.click());

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    })

    it('Открылось модальное окно изменения стоимости', async () => {
        await act(async () => render(
            <Boxes/>
        ))

        const btn = screen.getByRole('button', {name: /изменить/i});
        await act(async () => btn.click());

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    })

})
