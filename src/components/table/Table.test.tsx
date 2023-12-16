import {act, waitFor} from "@testing-library/react";
import {render, screen, userEvent} from "../../tests/utils/utils";
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
        let activeRow = -1;

        await act(async () => render(
            <Table<TestData> columns={columns} data={data} selectRowCallback={(i: number) => activeRow = i}/>
        ))

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 2000});

        const tr = screen.getAllByRole('cell')[0].closest("tr");
        const color = tr?.style.background;
        await userEvent.click(tr!);

        expect(activeRow).toBe(0);
        expect(screen.getAllByRole('cell')[0].closest("tr")?.style.background).not.toBe(color);

    })

    it('Выделение со строки должно сниматься по повторному клику', async () => {
        let activeRow = -1;

        await act(async () => render(
            <Table<TestData> columns={columns} data={data} selectRowCallback={(i: number) => activeRow = i}/>
        ))

        await waitFor(() => screen.getAllByRole('cell'), {timeout: 2000});

        const tr = screen.getAllByRole('cell')[0].closest("tr");
        const color = tr?.style.background;
        await userEvent.click(tr!);
        await userEvent.click(tr!);

        expect(activeRow).toBe(-1);
        expect(screen.getAllByRole('cell')[0].closest("tr")?.style.background).toBe(color);

    })

})
