import {IRenterResponse} from "../../../types/types";
import {Renter} from "../../../tests/mock/models";
import {renters} from "../../../tests/mock/data";

export class RentersMockData {
    get renters(): IRenterResponse[] {
        return this._renters;
    }

    updateRenter(value: IRenterResponse) {
        const renter = this._renters.find(r => r.id_renter === value.id_renter);

        if (!renter) return;
        renter.full_name = value.full_name;
        renter.phone = value.full_name;
        renter.address = value.full_name;
    }

    private _renters: Renter[] = renters;
}