import {useStores} from "../../store/RootStore";
import * as React from "react";
import {FC, useEffect, useState} from "react";
import {IBoxResponse} from "../../types/types";
import {Button, Form, Modal} from "react-bootstrap";
import Table from "../../components/Table/Table";
import {boxTableColumns} from "../../data/data";
import {observer} from "mobx-react-lite";

interface ISelectBoxModal {
    id: string;
    closeCallback: () => void;
    show: boolean;
    submitCallback: (id: number, receiptNumber: string) => void;
}

const SelectBoxModal: FC<ISelectBoxModal> = ({ id, closeCallback, show, submitCallback }) => {
    const { freeBoxesStore } = useStores();
    const [receiptNumber, setReceiptNumber] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (show) {
            freeBoxesStore.loadFreeByModelId(id);
        }
    }, [show]);

    const selectRowHandler = (index: number) => {
        freeBoxesStore.setSelectedBox(index);
    };

    function onChange(name: string, value: string) {
        setReceiptNumber(value);

        if (!value) {
            setError("Введите номер квитанции.");
            return;
        }
        if (isNaN(+value)) {
            setError("Некорректное значение.");
            return;
        }
        setError("");
    }

    return (
        <Modal size={"xl"} show={show} onHide={closeCallback}>
            <Modal.Header closeButton>
                <h5>Выбор бокса</h5>
            </Modal.Header>
            <Modal.Body>
                <Table<IBoxResponse>
                    columns={boxTableColumns}
                    data={freeBoxesStore.freeBoxesList}
                    selectRowCallback={selectRowHandler}
                    onlyOneValue={true}
                />
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="required-p">Номер квитанции</Form.Label>
                        <Form.Control
                            name="receiptNumber"
                            value={receiptNumber}
                            type="text"
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            isInvalid={!!error}
                            autoComplete={"off"}
                        />
                        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"secondary"} className={"px-3"} onClick={closeCallback}>
                    Отменить
                </Button>
                <Button
                    variant={"warning"}
                    className={"px-4"}
                    disabled={!freeBoxesStore.selectedBoxId}
                    onClick={() => {
                        if (receiptNumber && !error) {
                            submitCallback(freeBoxesStore.selectedBoxId!, receiptNumber);
                        }
                    }}
                >
                    Выбрать
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(SelectBoxModal);
