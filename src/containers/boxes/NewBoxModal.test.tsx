import {render, screen, userEvent} from '../../utils/utils'
import {act} from "@testing-library/react";
import NewBoxModal from "./NewBoxModal";
import {setupServer} from "msw/node";
import {http, HttpResponse} from "msw";

const server = setupServer(
    http.get("/data-service/models/all", ({request, params, cookies}) => {
        return HttpResponse.json([{"id_model": 78019625, "name": "Opel"}, {
            "id_model": 36074306,
            "name": "Ford"
        }, {"id_model": 911776857, "name": "Kia"}, {"id_model": 765420496, "name": "Volvo"}, {
            "id_model": 623580884,
            "name": "Lamborghini"
        }, {"id_model": 1477140551, "name": "Lada"}, {"id_model": 540846179, "name": "Haval"}])
    }),

    http.post('/data-service/boxes/add', async ({ request }) => {
        const info = await request.formData()
        console.log('Logging in as "%s"', info.get('username'))
    })
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())


describe('NewBoxModal ', async () => {

    it('Открылось окно добавления бокса', async () => {

        await act(async () => render(
            <NewBoxModal show={true} closeCallback={() => {}}></NewBoxModal>
        ))

        expect(screen.getByLabelText(/Номер бокса/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Модель/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Стоимость.*/)).toBeInTheDocument();
    })

    it('Ввод корректных значений в окно добавления бокса', async () => {

        await act(async () => render(
            <NewBoxModal show={true} closeCallback={() => {}}></NewBoxModal>
        ))

        const numberInput = screen.getByLabelText(/Номер бокса/);
        await userEvent.type(numberInput, "105");
        expect(numberInput).toHaveValue("105");

        const modelSelect = screen.getByLabelText(/Модель/);
        await userEvent.type(modelSelect, "op");
        await userEvent.click(screen.getByText("Opel"));
        expect(screen.getByText("Opel")).toBeInTheDocument();

        const costInput = screen.getByLabelText(/Стоимость.*/);
        await userEvent.type(costInput, "200");

        const btn = screen.getByText("Отправить");
        await userEvent.click(btn);

    })

    it('Ввод некорректных значений в окно добавления бокса', async () => {

        await act(async () => render(
            <NewBoxModal show={true} closeCallback={() => {}}></NewBoxModal>
        ))

        const numberInput = screen.getByLabelText(/Номер бокса/);
        await userEvent.type(numberInput, "строка");

        const costInput = screen.getByLabelText(/Стоимость.*/);
        await userEvent.type(costInput, "тоже строка");

        const btn = screen.getByText("Отправить");
        await userEvent.click(btn);
    })

})
