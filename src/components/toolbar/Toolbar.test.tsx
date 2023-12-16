import {render, screen, userEvent} from '../../tests/utils/utils'
import {act, fireEvent, waitFor} from "@testing-library/react";
import Toolbar, {ButtonData} from "./Toolbar";
import {FileMenuItemProps} from "./FileMenuItem";

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

describe('Toolbar', async () => {
    it('Все компоненты панели должны отображаться корректно', async () => {
        await act(async () => render(
                <Toolbar fileButtons={fileButtons} buttons={buttons}/>,
            )
        )

        for (let b of buttons) {
            const btn =  screen.getByRole('button', {name: b.name});
            expect(btn).toBeInTheDocument()
            b.disabled ? expect(btn).toBeDisabled() : expect(btn).not.toBeDisabled();
            fireEvent.mouseEnter(btn);
            expect(await screen.findByText(b.tooltip)).toBeInTheDocument();
        }
    })

    it('Выпадающий список справок должен открываться по клику на кнопку получения справок', async () => {
        await act(async () => render(
                <Toolbar fileButtons={fileButtons} buttons={buttons}/>,
            )
        )

        await userEvent.click(screen.getByRole('button', {name: "Получить справку"}))

        await waitFor(() => screen.getByRole('menu'));
        for (let button of fileButtons) {
            expect(await screen.findByText(button.title)).toBeInTheDocument()
        }
    })

})
