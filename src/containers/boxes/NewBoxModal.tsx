import * as React from "react";
import {FC, useEffect, useState} from "react";
import {Button, Form, FormControl, FormGroup, FormLabel, Modal} from "react-bootstrap";
import {IBoxCreate, IOption} from "../../types/types";
import CreatableSelect from "react-select/creatable";
import {observer} from "mobx-react-lite";
import {IModal} from "./IncreaseCostModal";
import {useStores} from "../../store/RootStore";

interface IBoxCreateError {
    box_number: string;
    model: string;
    daily_cost: string;
}

export interface IBoxCreateData {
    box_number: string;
    model: IOption;
    daily_cost: string;
}

const initialData: IBoxCreateData = {
    box_number: "",
    model: new IOption("", ""),
    daily_cost: "",
};

const initialErrors: IBoxCreateError = {
    box_number: "",
    model: "",
    daily_cost: "",
};

const CreateBoxModal: FC<IModal> = ({ show, closeCallback }) => {
    const { boxesStore, modelsStore } = useStores();

    const [models, setModels] = useState<IOption[]>();
    const [data, setData] = useState<IBoxCreateData>(initialData);
    const [errors, setErrors] = useState<IBoxCreateError>(initialErrors);

    useEffect(() => {
        if (!show) return;

        setData(initialData);
        setErrors(initialErrors);

        modelsStore.loadAll().then(() => {
            const options: IOption[] = modelsStore.modelsList.map(
                (model): IOption => new IOption(model.id_model.toString(), model.name),
            );

            setModels(options);
        });
    }, [show]);

    const onChangeSelect = (name: string, value: string | IOption | null) => {
        if (!value) {
            setData({
                ...data,
                [name]: {
                    value: "",
                    label: "",
                },
            });
            return;
        }

        setErrors({ ...errors, model: "" });

        if (typeof value === "string") {
            setData({
                ...data,
                [name]: {
                    value: "",
                    label: value,
                },
            });
            return;
        }

        setData({
            ...data,
            [name]: value,
        });
    };

    const onChangeNumberInput = (name: string, value: string) => {
        if (value && isNaN(+value)) {
            setErrors({ ...errors, [name]: "Недопустимое значение. Введите число." });
        }

        if (value) setErrors({ ...errors, [name]: "" });
        setData({ ...data, [name]: value });
    };

    const onClose = () => {
        closeCallback();
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const _errors = Object.assign({}, errors);
        if (!data.box_number) _errors.box_number = "Введите значение";
        if (!data.model) _errors.model = "Введите значение";
        if (!data.daily_cost) _errors.daily_cost = "Введите значение";

        if (!Object.values(_errors).filter((v) => v).length) {
            const box: IBoxCreate = {
                box_number: +data.box_number,
                daily_cost: +data.daily_cost,
                id_model: +data.model.value || null,
                model_name: data.model.label,
            };

            await boxesStore.saveNewBox(box);
            onClose();
        } else {
            setErrors(_errors);
        }
    };

    const modelCustomStyles = {
        // @ts-ignore
        control: (base, state) => ({
            ...base,
            borderColor: errors.model ? "#dc3545" : "#ddd",
            "&:hover": {
                borderColor: state.isFocused ? "#ddd" : errors.model ? "#dc3545" : "#ddd",
            },
        }),
    };

    return (
        <Modal show={show} onHide={closeCallback}>
            <Modal.Header closeButton>
                <Modal.Title>Добавить бокс</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate onSubmit={onSubmit}>
                    <FormGroup className="mb-3">
                        <FormLabel className="required">Номер бокса</FormLabel>
                        <FormControl
                            name="box_number"
                            value={data.box_number || ""}
                            onChange={(e) => onChangeNumberInput(e.target.name, e.target.value)}
                            isInvalid={!!errors.box_number}
                            type="text"
                            autoComplete={"off"}
                        />
                        <FormControl.Feedback type="invalid">{errors.box_number}</FormControl.Feedback>
                    </FormGroup>

                    <FormGroup className="mb-3">
                        <FormLabel className="required">Модель</FormLabel>
                        <CreatableSelect
                            formatCreateLabel={(inputText) => `Добавить "${inputText}"`}
                            styles={modelCustomStyles}
                            isClearable
                            onChange={(newValue) => onChangeSelect("model", newValue)}
                            onCreateOption={(newValue) => onChangeSelect("model", newValue)}
                            value={data.model}
                            options={models}
                        />
                        {errors.model && (
                            <div style={{ color: "#dc3545", fontSize: ".875em", marginTop: "5px" }}>{errors.model}</div>
                        )}
                    </FormGroup>

                    <FormGroup className="mb-3">
                        <FormLabel className="required">Стоимость (руб/сутки) </FormLabel>
                        <FormControl
                            name={"daily_cost"}
                            value={data.daily_cost || ""}
                            onChange={(e) => onChangeNumberInput(e.target.name, e.target.value)}
                            isInvalid={!!errors.daily_cost}
                            type="text"
                            autoComplete={"off"}
                        />
                        <FormControl.Feedback type="invalid">{errors.daily_cost}</FormControl.Feedback>
                    </FormGroup>
                    <Button type="submit" className={"me-2"}>
                        Отправить
                    </Button>
                    <Button type="reset" variant={"secondary"} onClick={onClose}>
                        Отмена
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default observer(CreateBoxModal);
