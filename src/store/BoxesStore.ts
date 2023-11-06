import {makeAutoObservable, runInAction} from "mobx";
import axios, {AxiosError} from "axios";
import {IBoxCreate, IBoxResponse, IModelCreate, IModelResponse} from "../types/types";
import {RootStore} from "./RootStore";

interface IBoxesStore {
    boxesList: IBoxResponse[];
    selectedBoxId: number | null;
    errorMessage: string;
    successMessage: string;
}

export class BoxesStore implements IBoxesStore {
    boxesList: IBoxResponse[] = [];
    selectedBoxId: number | null = null;
    errorMessage: string = "";
    successMessage: string = "";

    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    async loadAll(): Promise<void> {
        try {
            const response = await axios.get<IBoxResponse[]>("/data-service/boxes/all");

            runInAction(() => {
                this.boxesList = response.data;
                this.selectedBoxId = null;
            });
        } catch (e: any) {
            this.errorMessage = "Не удаётся получить список боксов.";
        }
    }

    async deleteSelectedBox() {
        try {
            console.log("Удаляем бокс №", this.selectedBoxId);

            await axios.delete(`/data-service/boxes/delete/${this.selectedBoxId}`);

            // ИЛИ delete this.boxesList[+this.selectedBoxesIdx];

            await this.loadAll();

            runInAction(() => {
                this.successMessage = "Бокс успешно удалён.";
            });
        } catch (error) {
            if ((error as AxiosError)?.response?.status === 400) {
                this.errorMessage =
                    "Ошибка удаления. Выбранный бокс содержит автомобиль. Прежде чем удалить бокс, его необходимо освободить.";
            } else {
                this.errorMessage = "Ошибка удаления.";
            }
        }
    }

    async saveNewBox(box: IBoxCreate): Promise<void> {
        console.log("Сохраняем объект", box);

        try {
            if (!box.id_model) {
                const model: IModelCreate = {
                    name: box.model_name,
                };

                console.log("Сохраняем модель", model);

                const modelResponse = await axios.post<IModelResponse>("/data-service/models/add", model);

                runInAction(() => {
                    box.id_model = modelResponse.data.id_model;
                });
                await this.rootStore.modelsStore.loadAll();
            }

            console.log("А теперь собранный бокс", box);
            await axios.post("/data-service/boxes/add", box);

            // ИЛИ this.boxesList.push(box)

            await this.loadAll();

            runInAction(() => {
                this.successMessage = "Бокс успешно добавлен.";
            });
        } catch (error) {
            this.errorMessage = "Ошибка добавления бокса.";
        }
    }

    async increaseCost(coef: number) {
        try {
            await axios.post(`/data-service/boxes/costUp/`, { coef: coef });
            this.loadAll();
        } catch (e) {
            this.errorMessage = "Не удаётся выполнить операцию.";
        }
    }

    setSelectedBox(index: number) {
        this.selectedBoxId = index < 0 ? null : this.boxesList[index].box_number;
    }

    clearErrorMessage() {
        this.errorMessage = "";
    }

    clearSuccessMessage() {
        this.successMessage = "";
    }
}
