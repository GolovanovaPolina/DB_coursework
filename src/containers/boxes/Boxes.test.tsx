import {render, screen} from '../../utils/utils'
import Boxes from "./Boxes";

describe('Boxes', async () => {
  it('Отобразилась таблица боксов', () => {
    render(
        <Boxes/>,
  )
    expect(screen.getByText('Номер бокса')).toBeInTheDocument()
    expect(screen.getByText('Поддерживаемая марка')).toBeInTheDocument()
    expect(screen.getByText('Стоимость (руб / сутки)')).toBeInTheDocument()
  })

})
