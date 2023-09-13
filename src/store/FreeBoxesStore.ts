import {makeAutoObservable, runInAction} from "mobx";
import axios from "axios";
import {IBoxResponse} from "../types/types";
import {RootStore} from "./RootStore";

interface IBoxesStore {
    freeBoxesList: IBoxResponse[];
    selectedBoxId: number | null;
    errorMessage: string;
}

export class FreeBoxesStore implements IBoxesStore {
    freeBoxesList: IBoxResponse[] = [];
    selectedBoxId: number | null = null;
    errorMessage: string = "";

    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    async loadFreeByModelId(id: string): Promise<void> {
        try {
            /*const response = await axios.get<IBoxResponse[]>(`/data-service/boxes/freeByModel/${id}`);

            runInAction(() => {
                this.freeBoxesList = response.data;
            })*/

            const response = await axios.get<IBoxResponse[]>(`/data-service/boxes/free`);
            const boxesList: IBoxResponse[] = response.data;

            runInAction(() => {
                this.freeBoxesList = boxesList.filter((box) => box.id_model == +id);
                this.selectedBoxId = null;
            });
        } catch (e: any) {
            this.errorMessage = "Не удаётся получить список пустых боксов для заданной модели.";
        }
    }

    setSelectedBox(index: number) {
        this.selectedBoxId = index < 0 ? null : this.freeBoxesList[index].box_number;
    }
}
