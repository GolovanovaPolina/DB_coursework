import {act} from "@testing-library/react";
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

describe('Boxes ', async () => {
    it('Строка должна выделяться по клику', async () => {
        let active = false;

        await act(async () => render(
            <Table<TestData> columns={columns} data={data} selectRowCallback={() => active = true}/>
        ))

        setTimeout(async () => {
            const row = await screen.findByRole("cell");
            const color = row.closest("tr")?.style.background;
            await row.click();
            expect(active).toBe(true);
            expect(row.closest("tr")?.style.background).not.toBe(color);
        }, 100)

    })

    it('Выделение со строки должно сниматься по повторному клику', async () => {
        let active = false;
        await act(async () => render(
            <Table<TestData> columns={columns} data={data} selectRowCallback={() => () => active = true}/>
        ))

        setTimeout(async () => {
            const row = await screen.findByRole("cell");
            const color = row.closest("tr")?.style.background;

            await row.click();
            await row.click();
            expect(active).toBe(false);
            expect(row.closest("tr")?.style.background).toBe(color);
        }, 100)

    })

})