import {makeAutoObservable, runInAction} from "mobx";
import {IRenterResponse} from "../types/types";
import {RootStore} from "./RootStore";
import axios from "axios";

interface IClientsStore {
    clientsList: IRenterResponse[];
    selectedClient: IRenterResponse | null;
    errorMessage: string;
    successMessage: string;
}

export class ClientsStore implements IClientsStore {
    errorMessage: string = "";
    successMessage: string = "";
    clientsList: IRenterResponse[] = [];
    selectedClient: IRenterResponse | null = null;

    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        makeAutoObservable(this);
    }

    async loadAll(): Promise<void> {
        try {
            const response = await axios.get<IRenterResponse[]>("/data-service/renters/all");

            runInAction(() => {
                this.clientsList = response.data;
            })

        } catch (e) {
            this.errorMessage = "Ошибка загрузки списка клиентов.";
        }

    }

    getById(id: string): IRenterResponse {
        return this.clientsList.find((client) => client.id_renter === +id)!;
    }

    setSelectedClient(index: number) {
        this.selectedClient = index < 0 ? null : this.clientsList[index];
    }

    async updateSelectedClient(data: IRenterResponse) {
        try {
            await axios.post("/data-service/renters/add", data);

            await this.loadAll();
            runInAction(() => {
                this.successMessage = "Данные успешно обновлены.";
            })

        } catch (error) {
            this.errorMessage = "Ошибка обновления данных о пользователе.";
        }
    }
}

