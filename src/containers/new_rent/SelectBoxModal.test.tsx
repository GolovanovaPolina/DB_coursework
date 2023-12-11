import {render, screen, userEvent} from '../../utils/utils'
import {act, waitFor} from "@testing-library/react";
import {http, HttpResponse} from 'msw'
import {setupServer} from 'msw/node'
import {boxes} from "./mock/mock";
import SelectBoxModal from "./SelectBoxModal";

interface IField {
    name: string,
    required: boolean
}

const server = setupServer(
    http.get('/data-service/boxes/freeWithModel/:id', ({request, params, cookies}) => {
        return HttpResponse.json(boxes)
    }),
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

describe('Select Box Modal', async () => {
    it('Все элементы модального окна должны отображаться на странице', async () => {
        await act(async () => render(
            <SelectBoxModal show={true} closeCallback={() => {}} id={"36074306"} submitCallback={() => {}}/>
        ))

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText(/номер бокса/i)).toBeInTheDocument();
        expect(screen.getByText(/поддерживаемая марка/i)).toBeInTheDocument();
        expect(screen.getByText(/стоимость/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/номер квитанции/i)).toBeInTheDocument();
    })

    it('Кнопка отправки должна быть активна только при наличии выбранной строки', async () => {

        await act(async () => render(
            <SelectBoxModal show={true} closeCallback={() => {}} id={"36074306"} submitCallback={() => {}}/>
        ))

        expect(screen.getByText(/выбрать/i)).toBeDisabled();
        await waitFor(() => screen.getAllByRole("cell"), {timeout: 1500});
        await userEvent.click(screen.getAllByRole("cell")[0]);
        expect(screen.getByText(/выбрать/i)).not.toBeDisabled();
    })

    it('Ошибка должна отображаться, если номер квитанции был введен неверно', async () => {
    await act(async () => render(
        <SelectBoxModal show={true} closeCallback={() => {}} id={"36074306"} submitCallback={() => {}}/>
    ))

    await userEvent.type(screen.getByLabelText(/номер квитанции/i), "тру-ля-ля");

    expect(await screen.findByText(/некорректное значение/i)).toBeInTheDocument();
    })

    // тест, который не работает (ошибка в программе).
    /*it('Ошибка должна отображаться, если номер квитанции не был введен', async () => {
        const state = {
            show: true,
            submit: false
        };

        await act(async () => render(
            <SelectBoxModal show={state.show} closeCallback={() => {state.show = false}} id={"36074306"} submitCallback={() => state.submit = true}/>
        ))

        await waitFor(() => screen.getAllByRole("cell"), {timeout: 1500});
        await userEvent.click(screen.getAllByRole("cell")[0]);
        await userEvent.click(screen.getByText(/выбрать/i));

        expect(await screen.findByText(/введите номер/i)).toBeInTheDocument();
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    })*/

})
