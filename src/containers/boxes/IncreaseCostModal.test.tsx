import {render, screen, userEvent} from '../../utils/utils'
import {act} from "@testing-library/react";

import {IncreaseCostModal} from "./IncreaseCostModal";

describe('IncreaseCostModal (module tests)', async () => {

    it('Открылось окно изменения стоимости', async () => {

        await act(async () => render(
            <IncreaseCostModal show={true} closeCallback={() => {}} />,
        ))

        expect(screen.getByLabelText(/Введите количество раз.*/)).toBeInTheDocument();
    })

    it('Установлено начальное значение коэффициента', async () => {

        await act(async () => render(
            <IncreaseCostModal show={true} closeCallback={() => {}} />,
        ))

        const counter = screen.getByLabelText(/Введите количество раз.*/);
        expect(counter).toHaveValue(1);
    })


    it('Увеличивается значение в модальном окне изменения стоимости', async () => {

        await act(async () => render(
            <IncreaseCostModal show={true} closeCallback={() => {}} />,
        ))

        const counter = screen.getByLabelText(/Введите количество раз.*/);
        expect(counter).toHaveValue(1);

        await userEvent.click(counter);
        await userEvent.keyboard('[ArrowUp]')

        expect(counter).toHaveValue(1.1);

    })

})
