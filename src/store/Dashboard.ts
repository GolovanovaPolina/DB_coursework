import {makeAutoObservable, runInAction} from "mobx";
import {RootStore} from "./RootStore";

interface IDashboardStore {
    totalBoxNumber: number;
    totalCarNumber: number;
}

export class DashboardStore implements IDashboardStore {
    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    totalBoxNumber: number = 0;
    totalCarNumber: number = 0;

    get freeBoxPercent(): number | string {
        if (!this.totalBoxNumber) return 0;

        return Math.round(((this.totalBoxNumber - this.totalCarNumber) / this.totalBoxNumber) * 10000) / 100;
    }

    loadData = async () => {
        const carsPromise = await this.rootStore.carsStore.loadAll();
        const boxesPromise = await this.rootStore.boxesStore.loadAll();

        Promise.all([carsPromise, boxesPromise]).then(() => {
            runInAction(() => {
                this.totalCarNumber = this.rootStore.carsStore.carsList.length;
                this.totalBoxNumber = this.rootStore.boxesStore.boxesList.length;
            });
        });
    };
}
