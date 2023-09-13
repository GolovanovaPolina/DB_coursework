import {makeAutoObservable, runInAction} from "mobx";
import {RootStore} from "./RootStore";
import {ICarCreate, IRenterCreate, IRenterResponse} from "../types/types";
import axios from "axios";
import {ICarCreateData} from "../containers/new_rent/NewRent";

interface ICarsStore {
    errorMessage: string;
    successMessage: string;
}

export class NewCarStore implements ICarsStore {
    successMessage: string = "";
    errorMessage: string = "";
    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    complementWithZeros = (date: number) => {
        return date < 10 ? `0${date.toString()}` : date.toString();
    };

    getFormattedDate = (d: Date) => {
        return (
            this.complementWithZeros(d.getDate()) +
            "." +
            this.complementWithZeros(d.getMonth() + 1) +
            "." +
            d.getFullYear()
        );
    };

    async saveNewCar(data: ICarCreateData): Promise<void> {
        console.log("Сохраняем объект", data);

        const car: ICarCreate = {
            automobile_number: `${data.automobileNumber} | ${data.automobileNumberRegion}`,
            box_number: +data.boxId!,
            id_renter: +data.renter.value || null,
            id_model: +data.model.value,
            rental_start_date: this.getFormattedDate(new Date()),
            receipt_number: +data.receiptNumber,
        };

        try {
            if (!car.id_renter) {
                const renter: IRenterCreate = {
                    full_name: data.renter.label,
                    phone: data.renterPhone,
                    address: data.renterAddress,
                };

                console.log("Сохраняем клиента", renter);

                const clientResponse = await axios.post<IRenterResponse>("/data-service/renters/add", renter);

                runInAction(() => {
                    car.id_renter = clientResponse.data.id_renter;
                });
                await this.rootStore.clientsStore.loadAll();
            }

            console.log("А теперь собранную машину", car);
            await axios.post("/data-service/cars/add", car);

            await this.rootStore.carsStore.loadAll();

            // ИЛИ this.boxesList.push(data)

            runInAction(() => {
                this.successMessage = "Аренда машины успешно зарегистрирована.";
            });
        } catch (error) {
            this.errorMessage = "Ошибка при регистрации аренды.";
        }
    }

    clearSuccessMessage() {
        this.successMessage = "";
    }

    clearErrorMessage() {
        this.errorMessage = "";
    }
}
