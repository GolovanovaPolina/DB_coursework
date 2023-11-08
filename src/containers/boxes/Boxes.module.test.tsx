import {render, screen} from '../../utils/utils'
import Boxes from "./Boxes";
import {act} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";

describe('Boxes (module tests)', async () => {
  it('Отобразилась таблица боксов', async () => {
    await act(async () => render(
            <Boxes/>,
            {wrapper: BrowserRouter}
        )
    )
    expect(screen.getByText('Номер бокса')).toBeInTheDocument()
    expect(screen.getByText('Поддерживаемая марка')).toBeInTheDocument()
    expect(screen.getByText('Стоимость (руб / сутки)')).toBeInTheDocument()
  })

})
