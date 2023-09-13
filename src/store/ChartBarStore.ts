import {makeAutoObservable, runInAction} from "mobx";
import {RootStore} from "./RootStore";
import {ChartData, ChartOptions} from "chart.js";
import {IChartElement} from "../types/types";
import axios from "axios";

interface IChartBarStore {
    data: ChartData<"bar">;
    options: ChartOptions<"bar">;
    totalBoxNumber: number;
    totalCarNumber: number;
}

export class ChartBarStore implements IChartBarStore {
    totalBoxNumber: number = 0;
    totalCarNumber: number = 0;
    options: ChartOptions<"bar"> = {};
    data: ChartData<"bar"> = {
        labels: [],
        datasets: [],
    };

    get freeBoxPercent(): number | string {
        if (!this.totalBoxNumber) return 0;

        return Math.round(((this.totalBoxNumber - this.totalCarNumber) / this.totalBoxNumber) * 10000) / 100;
    }

    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    loadData = async () => {
        try {
            const chartPromise = await axios.get<IChartElement[]>("/data-service/models/report");

            Promise.all([chartPromise]).then(() => {
                runInAction(() => {
                    this.data = this.formatData(chartPromise.data);

                    let totalCar = 0;
                    let totalBox = 0;
                    chartPromise.data.forEach((datum) => {
                        totalCar += datum.count_car;
                        totalBox += datum.count_box;
                    });
                    this.totalCarNumber = totalCar;
                    this.totalBoxNumber = totalBox;
                });
            });
        } catch (e: any) {}
    };

    private formatData(data: IChartElement[]) {
        const result: ChartData<"bar"> = {
            labels: [],
            datasets: [],
        };

        const dataSetBoxes: number[] = [];
        const dataSetCars: number[] = [];

        data.forEach((datum) => {
            result.labels?.push(datum.model_name);
            dataSetBoxes.push(datum.count_box);
            dataSetCars.push(datum.count_car);
        });

        result.datasets = [
            {
                label: " Число боксов",
                data: dataSetBoxes,
                backgroundColor: "#C0C0C0",
            },
            {
                label: " Число автомобилей",
                data: dataSetCars,
                backgroundColor: "#ffc107",
            },
        ];

        return result;
    }
}
