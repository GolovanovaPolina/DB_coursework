import {render, screen} from '../../utils/utils'
import {act} from "@testing-library/react";
import {setupServer} from "msw/node";
import {http, HttpResponse} from "msw";
import Dashboard from "./Dashboard";
import {vi} from "vitest";
import {modelsReport} from "./mock/mock";

const server = setupServer(
    http.get("/data-service/models/report", ({request, params, cookies}) => {
        return HttpResponse.json(modelsReport);
    })
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

describe('NewBoxModal ', async () => {

    it('Корректно отображаются все элементы окна статистики', async () => {



        await act(async () => render(
            <Dashboard />
        ))


        expect(screen.getByText(/Всего боксов/)).toBeInTheDocument();
        expect(screen.getByText(/Свободно/)).toBeInTheDocument();
        expect(screen.getByText(/Всего автомобилей/)).toBeInTheDocument();
        setTimeout(async () => {
            expect(screen.findByRole("img")).toBeInTheDocument();
        }, 1000);
    })

})
