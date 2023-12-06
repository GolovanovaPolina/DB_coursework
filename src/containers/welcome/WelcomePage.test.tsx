import {render, screen} from "../../utils/utils";
import {WelcomePage} from "./WelcomePage";
import {BrowserRouter} from "react-router-dom";
import {act} from "@testing-library/react";
import {ISection} from "../../components/navigation/Navigation";

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

describe('WelcomePage (module test)', async () => {
    it('Отобразить страницу приветствия', async () => {

        const text = "Добро пожаловать!";

        await act(async () => render(
            <WelcomePage/>,
            {wrapper: BrowserRouter}
        ));

        expect(screen.getByText(text)).toBeInTheDocument();
        for (let section of menu) {
            expect(screen.getByText(section.text)).toBeInTheDocument();
        }
    })
})