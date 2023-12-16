import {
    IBoxCreate,
    IBoxResponse,
    ICarCreate,
    ICarResponse,
    IModelCreate,
    IModelResponse,
    IRenterCreate,
    IRenterResponse
} from "../../types/types";
import {boxes, cars, models, renters} from "./data";
import {Box, Car, Model, Renter} from "./models";

export class MockData {
    get boxes(): IBoxResponse[] {
        return this._boxes;
    }

    addBox(value: IBoxCreate) {
        this._boxes = [...this._boxes, {
            ...value,
            id_model: value.id_model || this.addModel({name: value.model_name})
        }];
    }

    get cars(): ICarResponse[] {
        return this._cars.map(value => ({
            ...value,
            model_name: this._models.find(m => m.id_model === value.id_model)?.name || "",
            renter_full_name: this._renters.find(r => r.id_renter === value.id_renter)?.full_name || ""
        }));
    }

    addCar(value: ICarCreate): number {
        const id = this._cars[this._cars.length - 1].car_number + 1;
        this._cars = [...this._cars, {
            ...value,
            car_number: id
        }];

        return id;
    }

    get renters(): IRenterResponse[] {
        return this._renters;
    }

    addRenter(value: IRenterCreate): number {
        const id = this._renters[this._renters.length - 1].id_renter + 1;
        this._renters = [...this._renters, {
            id_renter: id,
            ...value
        }];

        return id;
    }

    get models(): IModelResponse[] {
        return this._models;
    }

    addModel(value: IModelCreate): number {
        const id = this._models[this._models.length - 1].id_model + 1;
        this._models = [...this._models, {
            id_model: id,
            ...value
        }];

        return id;
    }

    getBoxesByModel(id_model: number): IBoxResponse[] {
        return this._boxes.filter(value => value.id_model === id_model);
    }

    private _boxes: Box[] = boxes;
    private _cars: Car[] = cars;
    private _renters: Renter[] = renters;
    private _models: Model[] = models;
}