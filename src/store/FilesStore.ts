import {makeAutoObservable} from "mobx";
import {RootStore} from "./RootStore";
import axios from "axios";

interface IFilesStore {
    errorMessage: string;
    successMessage: string;
}

export class FilesStore implements IFilesStore {
    successMessage: string = "";
    errorMessage: string = "";

    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    async loadXml(path: string, params: Object | null) {
        try {
            const fullPath = `/data-service/${path}.xlsx`;
            const response = await axios.get(fullPath, { responseType: "blob", params: params });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${path}.xlsx`);
            document.body.appendChild(link);
            link.click();

            this.successMessage = "Файл успешно загружен.";
        } catch (error) {
            this.errorMessage = "Ошибка загрузки файла.";
        }
    }
}
