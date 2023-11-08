import {render, screen} from '../../utils/utils'
import Boxes from "./Boxes";
import {act} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";

describe('Boxes (integration tests)', async () => {
    it('Кнопка удаления активируется при выборе строки', async () => {
        await act(async () => render(
            <Boxes/>,
            {wrapper: BrowserRouter}
        ))

        const btn = screen.getByRole('button', {name: /удалить/i});
        expect(btn).toBeDisabled();

        /*const row = await screen.findByRole("row");
        await row.click();

        btn.click();
        expect(await screen.findByRole("dialog")).toBeInTheDocument();*/

    })

    it('Открылось модальное окно добавления бокса', async () => {
        await act(async () => render(
            <Boxes/>,
            {wrapper: BrowserRouter}
        ))

        const btn = screen.getByRole('button', {name: /добавить/i});

        await act(async () => btn.click());

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    })

    it('Открылось модальное окно изменения стоимости', async () => {
        await act(async () => render(
            <Boxes/>,
            {wrapper: BrowserRouter}
        ))

        const btn = screen.getByRole('button', {name: /изменить/i});

        await act(async () => btn.click());

        expect(await screen.findByRole("dialog")).toBeInTheDocument();
    })

})
