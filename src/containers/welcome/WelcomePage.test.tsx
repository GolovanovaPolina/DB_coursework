import {render, screen} from "../../utils/utils";
import {WelcomePage} from "./WelcomePage";
import {menu} from "../../components/Navigation";
import {BrowserRouter, useLocation} from "react-router-dom";
import {act} from "@testing-library/react";

export const LocationDisplay = () => {
    const location = useLocation()

    return <div data-testid="location-display">{location.pathname}</div>
}

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

    it('Перейти на страницу', async () => {

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