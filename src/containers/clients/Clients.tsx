import * as React from "react";
import {useEffect, useState} from "react";
import {Button, ButtonToolbar, Col, Container, Dropdown, Row} from "react-bootstrap";
import {clientsTableColumns} from "../../data/data";
import Table from "../../components/Table/Table";
import {observer} from "mobx-react-lite";
import {IRenterResponse} from "../../types/types";
import ClientEditModal from "./ClientEditModal";
import {Tooltip} from "../../components/Tooltip";
import {useStores} from "../../store/RootStore";
import {FileMenuItem} from "../../components/FileMenuItem";
import {SelectModelModal} from "./SelectModelModal";

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

    function showModelsModal() {
        setShowSelectModelModal(true);
    }

    function closeModelsModal() {
        setShowSelectModelModal(false);
    }

    return (
        <>
            <Container>
                <ButtonToolbar className="my-4">
                    <Tooltip text="Редактировать данные выбранного клиента">
                        <Button
                            variant="outline-dark"
                            className="me-2"
                            disabled={!clientsStore.selectedClient}
                            onClick={openEditModal}
                        >
                            <i className="bi-pen"></i>
                        </Button>
                    </Tooltip>

                    <Dropdown>
                        <Tooltip text="Получить справку">
                            <Dropdown.Toggle variant="outline-dark" className="me-2">
                                <i className="bi bi-filetype-xls"></i>
                            </Dropdown.Toggle>
                        </Tooltip>

                        <Dropdown.Menu>
                            <FileMenuItem
                                title={"О всех клиентах"}
                                onClick={() => filesStore.loadXml("all_clients", null)}
                            />

                            <FileMenuItem title={"О клиентах по модели автомобиля"} onClick={showModelsModal} />
                            <FileMenuItem
                                title={"О выбранном клиенте"}
                                isDisabled={!clientsStore.selectedClient}
                                onClick={() =>
                                    filesStore.loadXml(`client_in_box`, { box_number: clientsStore.selectedClient })
                                }
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                </ButtonToolbar>

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

            {/*<SuccessModal
                show={!!clientsStore.successMessage}
                closeCallback={() => clientsStore.clearSuccessMessage()}
                message={clientsStore.successMessage}
            />
            <ErrorModal
                show={!!clientsStore.errorMessage}
                closeCallback={() => clientsStore.clearErrorMessage()}
                message={clientsStore.errorMessage}
            />*/}
        </>
    );
};

export default observer(Clients);
