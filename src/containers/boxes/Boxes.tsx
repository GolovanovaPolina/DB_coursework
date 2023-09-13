import * as React from "react";
import {useEffect, useState} from "react";
import {Button, ButtonToolbar, Col, Container, Dropdown, Row} from "react-bootstrap";
import Table from "../../components/Table/Table";
import {boxTableColumns} from "../../data/data";
import BoxCreateModal from "./NewBoxModal";
import {observer} from "mobx-react-lite";
import {IBoxResponse} from "../../types/types";
import ErrorModal from "../../components/modals/ErrorModal";
import SuccessModal from "../../components/modals/SuccessModal";
import {Tooltip} from "../../components/Tooltip";
import {IncreaseCostModal} from "./IncreaseCostModal";
import {useStores} from "../../store/RootStore";
import {FileMenuItem} from "../../components/FileMenuItem";

const Boxes = () => {
    const { boxesStore, filesStore } = useStores();
    useEffect(() => {
        boxesStore.loadAll();
    }, []);

    const [showCreateBoxModal, setShowCreateBoxModal] = useState<boolean>(false);
    const [showIncreaseCostModal, setShowIncreaseCostModal] = useState<boolean>(false);

    const createBoxClickHandler = () => {
        setShowCreateBoxModal(true);
    };

    const closeCreateBoxModalHandler = () => {
        setShowCreateBoxModal(false);
    };

    const removeBoxClickHandler = () => {
        boxesStore.deleteSelectedBox();
    };

    const selectRowHandler = (index: number) => {
        boxesStore.setSelectedBox(index);
    };

    const increaseCostClickHandler = () => {
        setShowIncreaseCostModal(true);
    };

    const closeIncreaseCostClickHandler = () => {
        setShowIncreaseCostModal(false);
    };

    const getXMLPath = () => {};

    return (
        <>
            <Container>
                <Row className="my-4">
                    <ButtonToolbar>
                        <Tooltip text="Добавить бокс">
                            <Button variant="success" className="me-2" onClick={createBoxClickHandler}>
                                <i className="bi-plus-lg"></i>
                            </Button>
                        </Tooltip>
                        <Tooltip text="Удалить выбранный бокс">
                            <Button
                                variant="danger"
                                disabled={boxesStore.selectedBoxId === null}
                                data-bs-toggle="tooltip"
                                data-bs-html="true"
                                title="<em>Подсказка</em>"
                                className="me-2"
                                onClick={removeBoxClickHandler}
                            >
                                <i className="bi-trash" />
                            </Button>
                        </Tooltip>
                        <Tooltip text="Изменить стоимость аренды всех боксов">
                            <Button variant="outline-dark" className="me-2" onClick={increaseCostClickHandler}>
                                <i className="bi-pen" />
                            </Button>
                        </Tooltip>

                        <Dropdown>
                            <Tooltip text="Получить справку">
                                <Dropdown.Toggle variant="outline-dark" className="me-2">
                                    <i className="bi bi-filetype-xls"></i>
                                </Dropdown.Toggle>
                            </Tooltip>

                            <Dropdown.Menu className={"mt-1"}>
                                <FileMenuItem
                                    title={"О пустых боксах"}
                                    onClick={() => filesStore.loadXml("free_boxes", null)}
                                />
                                <FileMenuItem
                                    title={"О клиенте, занимающем выбранный бокс"}
                                    isDisabled={boxesStore.selectedBoxId === null}
                                    onClick={() =>
                                        filesStore.loadXml(`client_in_box`, { box_number: boxesStore.selectedBoxId })
                                    }
                                />
                            </Dropdown.Menu>
                        </Dropdown>
                    </ButtonToolbar>
                </Row>
                <Row>
                    <Col>
                        <Table<IBoxResponse>
                            selectRowCallback={selectRowHandler}
                            columns={boxTableColumns}
                            data={boxesStore.boxesList}
                        />
                    </Col>
                </Row>
            </Container>

            {<BoxCreateModal show={showCreateBoxModal} closeCallback={closeCreateBoxModalHandler} />}
            {<IncreaseCostModal show={showIncreaseCostModal} closeCallback={closeIncreaseCostClickHandler} />}

            {
                <SuccessModal
                    show={!!boxesStore.successMessage}
                    closeCallback={() => boxesStore.clearSuccessMessage()}
                    message={boxesStore.successMessage}
                />
            }
            {
                <ErrorModal
                    show={!!boxesStore.errorMessage}
                    closeCallback={() => boxesStore.clearErrorMessage()}
                    message={boxesStore.errorMessage}
                />
            }
        </>
    );
};

export default observer(Boxes);
