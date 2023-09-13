import {Button, Form, Modal} from "react-bootstrap";
import Select from "react-select";
import * as React from "react";
import {useEffect, useState} from "react";
import {IOption} from "../../types/types";
import {useStores} from "../../store/RootStore";

export function SelectModelModal(props: { onClose: () => void; isShow: boolean }) {
    const { modelsStore, filesStore } = useStores();

    const [model, setModel] = useState<IOption>(new IOption("", ""));
    const [error, setError] = useState<string>("");
    const [models, setModels] = useState<IOption[]>([]);

    useEffect(() => {
        modelsStore.loadAll().then(() => {
            const modelsList = modelsStore.modelsList.map(
                (model) => new IOption(model.id_model.toString(), model.name),
            );
            setModels(modelsList);
        });
    }, []);

    const modelCustomStyles = {
        // @ts-ignore
        control: (base, state) => ({
            ...base,
            borderColor: error ? "#dc3545" : "#ddd",
            "&:hover": {
                borderColor: state.isFocused ? "#ddd" : error ? "#dc3545" : "#ddd",
            },
        }),
    };

    function onChange(value: IOption | null) {
        if (!value) {
            setModel(new IOption("", ""));
            setError("Выберите модель.");
            return;
        }

        setError("");
        setModel(value);
    }

    function onSubmit() {
        if (!model.value) {
            setError("Выберите модель.");
            return;
        }

        filesStore.loadXml(`client_with_model`, { id_model: model.value });
        props.onClose();
    }

    function clear() {
        setModel(new IOption("", ""));
        setError("");
        props.onClose();
    }

    return (
        <Modal show={props.isShow}>
            <Modal.Header></Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="required-p">Модель</Form.Label>
                        <Select
                            styles={modelCustomStyles}
                            name="model"
                            value={model}
                            placeholder={"Название модели"}
                            onChange={onChange}
                            options={models}
                        />
                        {error && <div style={{ color: "#dc3545", fontSize: ".875em", marginTop: "5px" }}>{error}</div>}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={clear} variant="secondary" type="reset" className={"mb-3"}>
                    Закрыть
                </Button>
                <Button onClick={onSubmit} variant="warning" type="submit" className={"mb-3 me-3"}>
                    Скачать справку
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
