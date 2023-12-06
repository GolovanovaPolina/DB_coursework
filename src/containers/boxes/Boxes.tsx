import * as React from "react";
import {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import Table from "../../components/table/Table";
import {boxTableColumns} from "../../data/data";
import BoxCreateModal from "./NewBoxModal";
import {observer} from "mobx-react-lite";
import {IBoxResponse} from "../../types/types";
import ErrorModal from "../../components/modals/ErrorModal";
import SuccessModal from "../../components/modals/SuccessModal";
import {IncreaseCostModal} from "./IncreaseCostModal";
import {useStores} from "../../store/RootStore";
import {FileMenuItemProps} from "../../components/toolbar/FileMenuItem";
import Toolbar, {ButtonData} from "../../components/toolbar/Toolbar";

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

    const removeBoxClickHandler = async () => {
        await boxesStore.deleteSelectedBox();
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

    const buttons: ButtonData[] = [
        {
            name: "Добавить бокс",
            tooltip: "Добавить бокс",
            onClick: createBoxClickHandler,
            icon: "bi-plus-lg",
            variant: "success"
        },
        {
            name: "Удалить бокс",
            tooltip: "Удалить выбранный бокс",
            disabled: boxesStore.selectedBoxId === null,
            onClick: removeBoxClickHandler,
            icon: "bi-trash",
            variant: "danger"
        },
        {
            name: "Изменить стоимость",
            tooltip: "Изменить стоимость аренды всех боксов",
            onClick: increaseCostClickHandler,
            icon: "bi-pen",
            variant: "outline-dark"
        }
    ];

    const fileButtons: FileMenuItemProps[] = [
        {
            onClick: () => filesStore.loadXml("free_boxes", null),
            title: "О пустых боксах",
        },
        {
            onClick: () => filesStore.loadXml(`client_in_box`, { box_number: boxesStore.selectedBoxId }),
            isDisabled: boxesStore.selectedBoxId === null,
            title: "О клиенте, занимающем выбранный бокс",
        },
    ];


    return (
        <>
            <Container>
                <Row className="my-4">
                    <Toolbar buttons={buttons} fileButtons={fileButtons}/>
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
