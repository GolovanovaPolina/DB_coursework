import {act, fireEvent, RenderResult, waitFor} from "@testing-library/react";
import {render, screen, userEvent} from "./utils/utils"
import Boxes from "../containers/boxes/Boxes";
import {setupServer} from "msw/node";
import {http, HttpResponse} from "msw";
import {MockData} from "./mock/mock";
import NewRent from "../containers/new_rent/NewRent";
import Clients from "../containers/clients/Clients";

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
    http.get("/data-service/renters/all", ({request, params, cookies}) => {
        return HttpResponse.json(data.renters)
    }),
    http.get('/data-service/boxes/freeWithModel/:id', ({request, params, cookies}) => {
        return HttpResponse.json(data.getBoxesByModel(+params.id))
    }),
)

beforeAll(() => {
    server.listen()
})

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('App', async () => {
    it('Добавленный бокс должен отображаться в списке боксов на странице "Новое бронирование"', async () => {
        const newRentInstanse: Partial<RenderResult> = {};

        await act(async () => {
                const {container, unmount} = render(<NewRent/>);
                newRentInstanse.container = container;
                newRentInstanse.unmount = unmount;
            }
        );

        await userEvent.type(screen.getByLabelText(/клиент/i), "Смирнов{Enter}");
        await userEvent.type(screen.getByLabelText(/модель/i), "Opel{Enter}");
        await userEvent.type(screen.getByLabelText(/номер машины/i), "РК302А");
        await userEvent.type(screen.getByLabelText(/регион/i), "76");
        fireEvent.submit(screen.getByTestId("new-rent-form"));

        expect(screen.queryByText("600")).toBeNull();

        await newRentInstanse.unmount?.();

        const boxesInstanse: Partial<RenderResult> = {};
        await act(async () => {
                const {container, unmount} = render(<Boxes/>);
                boxesInstanse.container = container;
                boxesInstanse.unmount = unmount;
            }
        );

        await userEvent.click(screen.getByRole('button', {name: /добавить/i}))

        await waitFor(() => screen.getByRole("dialog"), {timeout: 2000});
        await userEvent.type(screen.getByLabelText(/номер бокса/i), "200");
        await userEvent.type(screen.getByLabelText(/модель/i), "Opel{Enter}");
        await userEvent.type(screen.getByLabelText(/^стоимость/i), "600");

        await userEvent.click(screen.getByText("Отправить"));

        await boxesInstanse.unmount?.();

        await act(async () => render(
            <NewRent/>,
        ));

        await userEvent.type(screen.getByLabelText(/клиент/i), "Смирнов{Enter}");
        await userEvent.type(screen.getByLabelText(/модель/i), "Opel{Enter}");
        await userEvent.type(screen.getByLabelText(/номер машины/i), "РК302А");
        await userEvent.type(screen.getByLabelText(/регион/i), "76");
        await userEvent.click(screen.getAllByText(/подобрать/i)[0]);
        expect(screen.getByText("600")).toBeInTheDocument();

    }, 15000)

    it('Добавленный клиент должен отображаться в списке клиентов на странице "Новое бронирование"', async () => {
        const newRentInstanse: Partial<RenderResult> = {};

        await act(async () => {
                const {container, unmount} = render(<NewRent/>);
                newRentInstanse.container = container;
                newRentInstanse.unmount = unmount;
            }
        );

        await userEvent.type(screen.getByLabelText(/ФИО/i), "Васечкин И.П.{Enter}");
        await userEvent.type(screen.getByLabelText(/телефон/i), "79019902030");
        await userEvent.type(screen.getByLabelText(/модель/i), "Opel{Enter}");
        await userEvent.type(screen.getByLabelText(/номер машины/i), "OP452А");
        await userEvent.type(screen.getByLabelText(/регион/i), "76");
        fireEvent.submit(screen.getByTestId("new-rent-form"));

        await waitFor(() => screen.getByRole("dialog"), {timeout: 2000});

        await waitFor(() => screen.getAllByRole("cell"), {timeout: 2000});
        await userEvent.click(screen.getAllByRole("cell")[0]);
        await userEvent.type(screen.getByLabelText("Номер квитанции"), "3748AT");
        await userEvent.click(screen.getByText(/выбрать/i));

        await newRentInstanse.unmount?.();

        await act(async () => render(
            <Clients/>,
        ));

        expect(screen.getByText("Васечкин И.П.")).toBeInTheDocument();

    }, 15000)


})

