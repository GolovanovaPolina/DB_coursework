import {BrowserRouter} from "react-router-dom";
import {act} from "@testing-library/react";
import {render, screen, userEvent} from "./utils/utils"
import {WelcomePage} from "../containers/welcome/WelcomePage";
import {ISection} from "../components/navigation/Navigation";
import Cars from "../containers/cars/Cars";
import {MockData} from "./mock/mock";
import {setupServer} from "msw/node";
import {http, HttpResponse} from "msw";

const data = new MockData();

const server = setupServer(
    http.get('/data-service/boxes/all', ({request, params, cookies}) => {
        return HttpResponse.json(data.boxes)
    }),
    http.post('/data-service/boxes/add', async ({request, params, cookies}) => {
        if (!request.body) return;

        const readableStream = request.body.pipeThrough(new TextDecoderStream("utf-8"));

        let str = "";
        // @ts-ignore
        for await (const stringChunk of readableStream) {
            str += stringChunk;
        }

        data.addBox(JSON.parse(str));
        return HttpResponse.json()
    }),
    http.get("/data-service/models/all", ({request, params, cookies}) => {
        return HttpResponse.json(data.models)
    }),
    http.get("/data-service/cars/all", ({request, params, cookies}) => {
        return HttpResponse.json(data.cars)
    }),
    http.get("/data-service/renters/all", ({request, params, cookies}) => {
        return HttpResponse.json(data.renters)
    }),
    http.get('/data-service/boxes/freeWithModel/:id', ({request, params, cookies}) => {
        return HttpResponse.json(data.getBoxesByModel(+params.id))
    }),
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

export const menu: ISection[] = [
    {
        text: "Боксы",
        url: "/boxes"
    },
    {
        text: "Клиенты",
        url: "/clients"
    },
    {
        text: "Автомобили",
        url: "/cars"
    },
    {
        text: "Новое бронирование",
        url: "/new-rent"
    },
    {
        text: "Статистика",
        url: "/statistics"
    },
]

describe('Navigation', async () => {
    it('Переход на любую страницу приложения с главной страницы должен осуществляться по клику на соответствующий пункт меню', async () => {

        await act(async () => render(
            <WelcomePage/>,
            {wrapper: BrowserRouter}
        ));


        for (let section of menu) {
            const el = screen.getByText(section.text);
            await act(() => el.click());

            expect(location.pathname.includes(section.url));
        }
    })

    it('Должно выполниться перенаправление на страницу «Новое бронирование» со страницы «Автомобили» для добавления нового автомобиля', async () => {
        await act(async () => render(
            <Cars/>,
            {wrapper: BrowserRouter}
        ))

        await userEvent.click(screen.getByRole('button', {name: /новый/i}));
        expect(location.pathname.includes("new-rent"));

    })

})