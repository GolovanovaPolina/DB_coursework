import {render, screen} from '../../utils/utils'
import {act} from "@testing-library/react";
import {InfoBlock} from "./InfoBlock";

describe('InfoBlock ', async () => {

    it('Все поля блока информации должны отображаться корректно', async () => {

        const count = 10;
        const text = "описание";

        await act(async () => render(
            <InfoBlock  count={count} desc={text}/>
        ))

        expect(screen.getByText(count)).toBeInTheDocument();
        expect(screen.getByText(text)).toBeInTheDocument();
    })

})
