import {render, screen} from '../../utils/utils'
import ErrorModal from "./ErrorModal";

describe('ErrorModal', async () => {
    it('Отобразить окно с сообщением об успехе', () => {

        const closeCallback = () => {}
        const text = "Запись успешно добавлена";

        render(
            <ErrorModal show={true} message={text} closeCallback={closeCallback}/>,
        )

        expect(screen.getByText(text)).toBeInTheDocument();
    })

    it('Не отображать окно с сообщением об успехе', () => {

        const closeCallback = () => {}
        const text = "Запись успешно добавлена";

        render(
            <ErrorModal show={false} message={text} closeCallback={closeCallback}/>,
        )

        expect(screen.queryByText(text)).toBe(null);
    })

})
