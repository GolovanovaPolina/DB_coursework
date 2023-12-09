import * as React from "react";
import {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {clientsTableColumns} from "../../data/data";
import Table from "../../components/table/Table";
import {observer} from "mobx-react-lite";
import {IRenterResponse} from "../../types/types";
import ClientEditModal from "./ClientEditModal";
import {useStores} from "../../store/RootStore";
import {FileMenuItemProps} from "../../components/toolbar/FileMenuItem";
import {SelectModelModal} from "./SelectModelModal";
import Toolbar, {ButtonData} from "../../components/toolbar/Toolbar";
import SuccessModal from "../../components/modals/SuccessModal";
import ErrorModal from "../../components/modals/ErrorModal";

const Clients = () => {
    const { clientsStore, filesStore } = useStores();
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showSelectModelModal, setShowSelectModelModal] = useState<boolean>(false);

    useEffect(() => {
        clientsStore.loadAll();
    }, []);

    function closeEditModal() {
        setShowEditModal(false);
    }

    function openEditModal() {
        setShowEditModal(true);
    }

    const selectRow = (index: number) => {
        clientsStore.setSelectedClient(index);
    };

    function closeModelsModal() {
        setShowSelectModelModal(false);
    }

    const buttons: ButtonData[] = [
        {
            name: "Редактировать данные выбранного клиента",
            tooltip: "Редактировать данные выбранного клиента",
            disabled: clientsStore.selectedClient === null,
            onClick: openEditModal,
            icon: "bi-pen",
            variant: "outline-dark"
        },
    ];

    const fileButtons: FileMenuItemProps[] = [
        {
            title: "О всех клиентах",
            onClick: () => filesStore.loadXml("all_clients", null),
        },
        {
            title: "О клиентах по модели автомобиля",
            onClick: () => setShowSelectModelModal(true),
        },
        {

            title: "О выбранном клиенте",
            onClick: () => filesStore.loadXml(`client_in_box`, { box_number: clientsStore.selectedClient }),
            isDisabled: !clientsStore.selectedClient
        },
    ];


    return (
        <>
            <Container>
                <Toolbar buttons={buttons} fileButtons={fileButtons}/>

                <Row>
                    <Col>
                        <Table<IRenterResponse>
                            columns={clientsTableColumns}
                            data={clientsStore.clientsList}
                            selectRowCallback={selectRow}
                            onlyOneValue={true}
                        />
                    </Col>
                </Row>
            </Container>

            {clientsStore.selectedClient && showEditModal && (
                <ClientEditModal
                    show={showEditModal}
                    closeCallback={closeEditModal}
                    initialData={clientsStore.selectedClient}
                />
            )}
            {showSelectModelModal && <SelectModelModal isShow={showSelectModelModal} onClose={closeModelsModal} />}

            <SuccessModal
                show={!!clientsStore.successMessage}
                closeCallback={() => clientsStore.clearSuccessMessage()}
                message={clientsStore.successMessage}
            />
            <ErrorModal
                show={!!clientsStore.errorMessage}
                closeCallback={() => clientsStore.clearErrorMessage()}
                message={clientsStore.errorMessage}
            />
        </>
    );
};

export default observer(Clients);
