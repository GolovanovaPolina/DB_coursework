import {render, screen} from '../../utils/utils'
import {act} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import Toolbar, {ButtonData} from "./Toolbar";
import {FileMenuItemProps} from "../FileMenuItem";

const buttons: ButtonData[] = [
    {
        name: "Добавить",
        tooltip: "Добавить",
        onClick: () => {},
        icon: "bi-plus-lg",
        variant: "success"
    },
    {
        name: "Удалить",
        tooltip: "Удалить",
        disabled: true,
        onClick: () => {},
        icon: "bi-trash",
        variant: "danger"
    },
];

const fileButtons: FileMenuItemProps[] = [
    {
        onClick: () => {},
        title: "Справка №1",
    },
    {
        onClick: () => {},
        isDisabled: true,
        title: "Справка №2",
    },
];

describe('Toolbar (module tests)', async () => {
    it('Отобразилась панель управления', async () => {

        await act(async () => render(
                <Toolbar fileButtons={fileButtons} buttons={buttons}/>,
                {wrapper: BrowserRouter}
            )
        )

        for (let button of buttons) {
            expect(screen.getByRole('button', {name: button.name})).toBeInTheDocument()
        }
    })

    it('Открывается выпадающий список справок', async () => {

        await act(async () => render(
                <Toolbar fileButtons={fileButtons} buttons={buttons}/>,
                {wrapper: BrowserRouter}
            )
        )

        const reportBtn = screen.getByRole('button', {name: "Получить справку"});
        await act(async  () => reportBtn.click());

        expect(await screen.findByRole('menu')).toBeInTheDocument()

        for (let button of fileButtons) {
            expect(await screen.findByText(button.title)).toBeInTheDocument()
        }
    })

})
