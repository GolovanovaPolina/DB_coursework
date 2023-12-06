import {BrowserRouter} from "react-router-dom";
import {act} from "@testing-library/react";
import {render, screen} from "../../utils/utils"
import {WelcomePage} from "../../containers/welcome/WelcomePage";
import {ISection} from "./Navigation";

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

describe('Navigation (integration test)', async () => {
    it('Перейти на страницу с главной страницы', async () => {

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
})


// добавить переход с других страниц и проверку выделения.