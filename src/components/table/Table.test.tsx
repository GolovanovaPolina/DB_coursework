import {act, waitFor} from "@testing-library/react";
import {render, screen} from "../../utils/utils";
import Table from "./Table";

interface TestData {
    id: number;
    name: string;
}

const columns = [
    {
        "Header": "ID",
        "accessor": "id"
    },
    {
        "Header": "Наименование",
        "accessor": "name"
    },
]

const data: TestData[] = [
    {
        id: 100,
        name: "Строка"
    },
    {
        id: 101,
        name: "Строка"
    }
]

describe('Table ', async () => {
    it('Строка должна выделяться по клику', async () => {
        let active = false;

        await act(async () => render(
            <Table<TestData> columns={columns} data={data} selectRowCallback={() => active = !active}/>
        ))

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 1500});

        const color = screen.getAllByRole('cell')[0].closest("tr")?.style.background;
        const cell = screen.getAllByRole('cell')[0];

        await act(async () => {
            await cell.click();
        })
        expect(active).toBe(true);
        expect(cell.closest("tr")?.style.background).not.toBe(color);

    })

    it('Выделение со строки должно сниматься по повторному клику', async () => {
        let active = false;
        await act(async () => render(
            <Table<TestData> columns={columns} data={data} selectRowCallback={() => () => active = !active}/>
        ))

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 1500});

        const color = screen.getAllByRole('cell')[0].closest("tr")?.style.background;
        const cell = screen.getAllByRole('cell')[0];

        await act(async () => {
            await cell.click();
        })
        await act(async () => {
            await cell.click();
        })
        expect(active).toBe(false);
        expect(cell.closest("tr")?.style.background).toBe(color);
    })

})
