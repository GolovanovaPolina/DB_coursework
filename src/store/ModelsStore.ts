import {makeAutoObservable, runInAction} from "mobx";
import axios from "axios";
import {IModelResponse} from "../types/types";
import {RootStore} from "./RootStore";

interface IModelsStore {
    modelsList: IModelResponse[];
}

export class ModelsStore implements IModelsStore {
    modelsList: IModelResponse[] = [];

    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    async loadAll(): Promise<void> {
        try {
            const response = await axios.get("/data-service/models/all");

            runInAction(() => {
                this.modelsList = response.data;
            })

        } catch (e) {

        }
    }


    getById(id: string | undefined): IModelResponse | null {
        if (!id) return null;
        return this.modelsList.find((model) => model.id_model === +id) || null;
    }
}
