import * as React from "react";
import {useEffect, useState} from "react";
import {IOption} from "../../types/types";
import {Button, Col, Container, Form, FormGroup, FormLabel, Row} from "react-bootstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import InputMask from "react-input-mask";
import {useStores} from "../../store/RootStore";
import SelectBoxModal from "./SelectBoxModal";
import clsx from "clsx";
import {observer} from "mobx-react-lite";
import SuccessModal from "../../components/modals/SuccessModal";
import ErrorModal from "../../components/modals/ErrorModal";

export interface ICarCreateData {
    automobileNumberRegion: string;
    automobileNumber: string;
    renter: IOption;
    renterPhone: string;
    renterAddress: string;
    receiptNumber: string;
    model: IOption;
    boxId: number | null;
}

interface ICarCreateError {
    automobileNumberRegion: string;
    automobileNumber: string;
    renter: string;
    renterPhone: string;
    model: string;
}

const initialCarData: ICarCreateData = {
    automobileNumber: "",
    automobileNumberRegion: "",
    renter: new IOption("", ""),
    renterPhone: "",
    renterAddress: "",
    receiptNumber: "",
    model: new IOption("", ""),
    boxId: null,
};

const initialCarErrors: ICarCreateError = {
    automobileNumber: "",
    automobileNumberRegion: "",
    renter: "",
    renterPhone: "",
    model: "",
};

const NewRent = () => {
    const { modelsStore, clientsStore, newCarStore } = useStores();

    const [models, setModels] = useState<IOption[]>([]);
    const [renters, setRenters] = useState<IOption[]>([]);

    const [data, setData] = useState<ICarCreateData>(initialCarData);
    const [errors, setErrors] = useState<ICarCreateError>(initialCarErrors);

    const [isClientEditable, setClientEditable] = useState<boolean>(false);
    const [showFreeBoxesModal, setShowFreeBoxesModal] = useState<boolean>(false);

    useEffect(() => {
        modelsStore.loadAll().then(() => {
            const modelsList = modelsStore.modelsList.map(
                (model) => new IOption(model.id_model.toString(), model.name),
            );
            setModels(modelsList);
        });

        clientsStore.loadAll().then(() => {
            const clientsList = clientsStore.clientsList.map(
                (client) => new IOption(client.id_renter.toString(), client.full_name),
            );
            setRenters(clientsList);
        });
    }, []);

    const showFreeBoxes = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const _errors = Object.assign({}, errors);

        Object.keys(errors).forEach((key) => {
            if (["model", "renter"].includes(key)) {
                // @ts-ignore
                if (!data[key].label) {
                    // @ts-ignore
                    _errors[key] = "Введите значение";
                }
            } else {
                // @ts-ignore
                if (!data[key]) _errors[key] = "Введите значение";
            }
        });

        if (!Object.values(_errors).filter((v) => v).length) {
            setShowFreeBoxesModal(true);
            return;
        }

        setErrors(_errors);
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

    const renterCustomStyles = {
        // @ts-ignore
        control: (base, state) => ({
            ...base,
            borderColor: errors.renter ? "#dc3545" : "#ddd",
            "&:hover": {
                borderColor: state.isFocused ? "#ddd" : errors.model ? "#dc3545" : "#ddd",
            },
        }),
    };

    const onSelectRenter = (value: string | IOption | null) => {
        if (!value) {
            setData({
                ...data,
                renter: new IOption("", ""),
                renterPhone: "",
                renterAddress: "",
            });
            setClientEditable(false);
            setErrors({ ...errors, renter: "" });
            return;
        }

        setErrors({ ...errors, renter: "" });

        if (typeof value === "string") {
            setData({
                ...data,
                renter: new IOption("", value),
                renterPhone: "",
                renterAddress: "",
            });
            setClientEditable(true);
            return;
        }

        const renter = clientsStore.getById(value.value);
        setData({
            ...data,
            renter: value,
            renterPhone: renter.phone,
            renterAddress: renter.address,
        });
        setClientEditable(false);
    };

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

    const onChange = (name: string, value: string) => {
        if (value) setErrors({ ...errors, [name]: "" });
        setData({ ...data, [name]: value });
    };

    const onBlurMaskedInput = (name: string, value: string) => {
        if (!value || value.includes("_")) setErrors({ ...errors, [name]: "Некорректное значение" });
    };

    const onFocusMaskedInput = (name: string, value: string) => {
        setErrors({ ...errors, [name]: "" });
    };

    const phoneClassName = clsx(
        "form-control",
        { "phone-control": !errors.renterPhone },
        { "phone-control-danger": errors.renterPhone },
    );

    const closeFreeBoxesModal = () => {
        setShowFreeBoxesModal(false);
    };

    async function onSubmit(id: number, receiptNumber: string) {
        await newCarStore.saveNewCar({ ...data, boxId: id, receiptNumber: receiptNumber });

        closeFreeBoxesModal();
        setData(initialCarData);
        setErrors(initialCarErrors);
    }

    function clear() {
        setData(initialCarData);
        setErrors(initialCarErrors);
    }

    return (
        <>
            <Container>
                <Form>
                    <FormGroup className="mb-3">
                        <FormLabel className="required-p">Клиент</FormLabel>
                        <CreatableSelect
                            formatCreateLabel={(inputText) => `Добавить "${inputText}"`}
                            styles={renterCustomStyles}
                            isClearable
                            onChange={(newValue) => onSelectRenter(newValue)}
                            onCreateOption={(newValue) => onSelectRenter(newValue)}
                            value={data.renter}
                            options={renters}
                        />
                        {errors?.renter && (
                            <div style={{ color: "#dc3545", fontSize: ".875em", marginTop: "5px" }}>
                                {errors.renter}
                            </div>
                        )}
                    </FormGroup>

                    <Form.Group className="mb-3">
                        <Form.Label className="required-p">Телефон</Form.Label>
                        <InputMask
                            className={phoneClassName}
                            mask="+9(999) 999-9999"
                            name={"renterPhone"}
                            value={data.renterPhone}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            onBlur={(e) => onBlurMaskedInput(e.target.name, e.target.value)}
                            onFocus={(e) => onFocusMaskedInput(e.target.name, e.target.value)}
                            required
                            readOnly={!isClientEditable}
                        />
                        {errors.renterPhone && (
                            <div style={{ color: "#dc3545", fontSize: ".875em", marginTop: "5px" }}>
                                {errors.renterPhone}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Адрес</Form.Label>
                        <Form.Control
                            name="renterAddress"
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            value={data.renterAddress}
                            type="text"
                            readOnly={!isClientEditable}
                            autoComplete={"off"}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="required-p">Модель</Form.Label>
                        <Select
                            styles={modelCustomStyles}
                            name="model"
                            value={data.model}
                            placeholder={"Название модели"}
                            onChange={(newValue) => onChangeSelect("model", newValue)}
                            options={models}
                        />
                        {errors.model && (
                            <div style={{ color: "#dc3545", fontSize: ".875em", marginTop: "5px" }}>{errors.model}</div>
                        )}
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label className="required-p">Номер машины</Form.Label>
                                <Form.Control
                                    name="automobileNumber"
                                    value={data.automobileNumber}
                                    type="text"
                                    onChange={(e) => onChange(e.target.name, e.target.value)}
                                    isInvalid={!!errors.automobileNumber}
                                    autoComplete={"off"}
                                />
                                <Form.Control.Feedback type="invalid">{errors.automobileNumber}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label className="required-p">Регион</Form.Label>
                                <Form.Control
                                    name="automobileNumberRegion"
                                    value={data.automobileNumberRegion}
                                    type="text"
                                    onChange={(e) => onChange(e.target.name, e.target.value)}
                                    isInvalid={!!errors.automobileNumberRegion}
                                    autoComplete={"off"}
                                />
                                <Form.Control.Feedback type="invalid">{errors.automobileNumber}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button onClick={showFreeBoxes} variant="warning" type="submit" className={"mb-3 me-3"}>
                        Подобрать бокс
                    </Button>
                    <Button onClick={clear} variant="secondary" type="reset" className={"mb-3"}>
                        Очистить
                    </Button>
                </Form>

                <SelectBoxModal
                    show={showFreeBoxesModal}
                    id={data.model.value}
                    closeCallback={closeFreeBoxesModal}
                    submitCallback={onSubmit}
                />
            </Container>

            <SuccessModal
                show={!!newCarStore.successMessage}
                closeCallback={() => newCarStore.clearSuccessMessage()}
                message={newCarStore.successMessage}
            />
            <ErrorModal
                show={!!newCarStore.errorMessage}
                closeCallback={() => newCarStore.clearErrorMessage()}
                message={newCarStore.errorMessage}
            />
        </>
    );
};

export default observer(NewRent);
