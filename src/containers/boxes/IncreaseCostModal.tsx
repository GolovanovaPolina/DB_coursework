import {Button, Form, Modal} from "react-bootstrap";
import * as React from "react";
import {FC, useState} from "react";
import {useStores} from "../../store/RootStore";

export interface IModal {
    show: boolean;
    closeCallback: () => void;
}

export const IncreaseCostModal: FC<IModal> = ({ show, closeCallback }) => {
    const { boxesStore, modelsStore } = useStores();

    const [coefficient, setCoefficient] = useState<number>(1);

    const onCoefficientChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCoefficient(+event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await boxesStore.increaseCost(coefficient);
        closeCallback();
    };

    return (
        <Modal show={show} onHide={closeCallback}>
            <Modal.Header closeButton>
                <Modal.Title>Изменить стоимость аренды</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Введите количество раз (можно дробное), в которое необходимо увеличить / уменьшить
                            стоимость:{" "}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            step="0.1"
                            onChange={onCoefficientChangeHandler}
                            value={coefficient}
                        />
                    </Form.Group>
                    <Button type="submit">Отправить</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
