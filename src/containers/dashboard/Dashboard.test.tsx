import {render, screen} from '../../utils/utils'
import {act} from "@testing-library/react";
import {setupServer} from "msw/node";
import {http, HttpResponse} from "msw";
import Dashboard from "./Dashboard";
import {vi} from "vitest";

const server = setupServer(
    http.get("/data-service/models/report", ({request, params, cookies}) => {
        return HttpResponse.json([
            {
                "model_name": "Opel",
                "count_box": 1,
                "count_car": 0
            },
            {
                "model_name": "Ford",
                "count_box": 1,
                "count_car": 0
            },
            {
                "model_name": "Tesla",
                "count_box": 1,
                "count_car": 0
            },
            {
                "model_name": "Lada",
                "count_box": 2,
                "count_car": 0
            }
        ])
    })
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())


describe('NewBoxModal (module tests)', async () => {

    it('Открылось окно статистики', async () => {

        const ResizeObserverMock = vi.fn(() => ({
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn(),
        }));

        vi.stubGlobal('ResizeObserver', ResizeObserverMock);
        await act(async () => render(
            <Dashboard />
        ))

        expect(screen.getByText(/Всего боксов/)).toBeInTheDocument();
        expect(screen.getByText(/Свободно/)).toBeInTheDocument();
        expect(screen.getByText(/Всего автомобилей/)).toBeInTheDocument();

        // ещё проверить диаграмму.
    })

})
