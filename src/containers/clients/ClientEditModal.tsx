import * as React from 'react';
import {FC, useEffect, useState} from 'react';
import {Button, ButtonToolbar, Form, Modal} from "react-bootstrap";
import {IRenterResponse} from "../../types/types";
import {observer} from "mobx-react-lite";
import InputMask from "react-input-mask";
import {IModal} from "../boxes/IncreaseCostModal";
import "./styles.less";
// @ts-ignore
import clsx from 'clsx';
import {useStores} from "../../store/RootStore";

export interface IEditModal<T> extends IModal{
    initialData: T;
}

interface IEditClientErrors {
    fullName: string;
    phone: string;
}

const initialErrors: IEditClientErrors = {
    fullName: '',
    phone: '',
}

const ClientEditModal: FC<IEditModal<IRenterResponse>> = ({closeCallback, show, initialData}) => {
    const { clientsStore} = useStores();

    const [data, setData] = useState<IRenterResponse>(initialData);
    const [errors, setErrors] = useState<IEditClientErrors>(initialErrors);

    useEffect(() => {
        if (show) {
            setErrors(initialErrors);
        }

    }, [show])

    function onClose() {
        closeCallback();
    }

    const onChange = (name: string, value: string) => {
        setData({...data, [name]: value});
    };

    const onBlurMaskedInput = (name: string, value: string) => {
        if (!value || value.includes("_")) setErrors({...errors, [name]: "Некорректное значение"})
    }

    const onFocusMaskedInput = (name: string, value: string) => {
        setErrors({...errors, [name]: ""})
    }


    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const _errors = Object.assign({}, errors);
        if (!data.full_name) _errors.fullName = "Введите значение";

        setErrors(_errors);

        if (!Object.values(_errors).filter((v) => v).length) {
            await clientsStore.updateSelectedClient(data);
            onClose();
        } else {
            setErrors(_errors);
        }
    }

    const phoneClassName = clsx(
        'form-control',
        { 'phone-control': !errors.phone },
        { 'phone-control-danger': errors.phone }
    );

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Редактирование данных о клиенте</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="required">ФИО</Form.Label>
                        <Form.Control
                            name="fullName"
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            value={data.full_name}
                            type="text"
                            autoComplete={"off"}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="required" >Телефон</Form.Label>
                        <InputMask className={phoneClassName}
                                   mask="+9(999) 999-9999"
                                   name={"phone"}
                                   value={data.phone}
                                   onChange={(e) => onChange(e.target.name, e.target.value)}
                                   onBlur={(e) => onBlurMaskedInput(e.target.name, e.target.value)}
                                   onFocus={(e) => onFocusMaskedInput(e.target.name, e.target.value)}
                                   required
                        />
                        {errors.phone && <div style={{color: "#dc3545", fontSize: ".875em", marginTop: "5px"}}>{errors.phone}</div>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Адрес</Form.Label>
                        <Form.Control
                            name="address"
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            value={data.address}
                            type="text"
                        />
                    </Form.Group>

                    <ButtonToolbar>
                        <Button className="me-3" type="submit">Отправить</Button>
                        <Button onClick={onClose} variant="secondary">Отменить</Button>
                    </ButtonToolbar>
                </Form>
            </Modal.Body>

        </Modal>
    );
};

export default observer(ClientEditModal);