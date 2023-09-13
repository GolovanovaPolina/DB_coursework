import {makeAutoObservable, runInAction} from "mobx";
import {RootStore} from "./RootStore";
import {ICarResponse} from "../types/types";
import axios from "axios";

interface ICarsStore {
    errorMessage: string;
    successMessage: string;
    selectedCarId: number | null;
    carsList: ICarResponse[];
}

export class CarsStore implements ICarsStore {
    successMessage: string = "";
    selectedCarId: number | null = null;
    carsList: ICarResponse[] = [];
    errorMessage: string = "";
    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    async loadAll() {
        try {
            const response = await axios.get<ICarResponse[]>("/data-service/cars/all");

            runInAction(() => {
                this.carsList = response.data;
                this.successMessage = "";
            });
        } catch (e: any) {
            this.errorMessage = "Не удалось загрузить список автомобилей.";
        }
    }

    setSelectedCar(index: number) {
        this.selectedCarId = index < 0 ? null : this.carsList[index].car_number;
    }

    async deleteSelectedCar() {
        try {
            console.log("Удаляем машину №", this.selectedCarId);
            await axios.delete(`/data-service/cars/delete/${this.selectedCarId}`);

            // ИЛИ delete this.boxesList[+this.selectedBoxesIdx];

            await this.loadAll();

            runInAction(() => {
                this.successMessage = "Машина успешно удалена.";
            });
        } catch (error) {
            this.errorMessage = "Ошибка удаления.";
        }
    }

    clearSuccessMessage() {
        this.successMessage = "";
    }

    clearErrorMessage() {
        this.errorMessage = "";
    }
}
