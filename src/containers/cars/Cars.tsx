import React, {useEffect} from "react";
import {Button, ButtonToolbar, Col, Container, Dropdown, Row} from "react-bootstrap";
import {Tooltip} from "../../components/Tooltip";
import Table from "../../components/Table/Table";
import {ICarResponse} from "../../types/types";
import {carsTableColumns} from "../../data/data";
import SuccessModal from "../../components/modals/SuccessModal";
import ErrorModal from "../../components/modals/ErrorModal";
import {useStores} from "../../store/RootStore";
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom";
import {FileMenuItem} from "../../components/FileMenuItem";

export type CarsProps = {};
const Cars: React.FC<CarsProps> = ({}) => {
    const { carsStore, filesStore } = useStores();

    useEffect(() => {
        carsStore.loadAll();
    }, []);

    function removeBoxClickHandler() {
        carsStore.deleteSelectedCar();
    }

    function selectRowHandler(index: number) {
        carsStore.setSelectedCar(index);
    }

    return (
        <>
            <Container>
                <Row className="my-4">
                    <ButtonToolbar>
                        <Tooltip text="Новый автомобиль">
                            <Button variant="success" className="me-2">
                                <Link to="/new-rent">
                                    <i className="bi-plus-lg text-white"></i>
                                </Link>
                            </Button>
                        </Tooltip>
                        <Tooltip text="Удалить автомобиль из бокса">
                            <Button
                                variant="danger"
                                disabled={carsStore.selectedCarId === null}
                                data-bs-toggle="tooltip"
                                data-bs-html="true"
                                title="<em>Подсказка</em>"
                                className="me-2"
                                onClick={removeBoxClickHandler}
                            >
                                <i className="bi-trash" />
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
                                    title={"Квитанция на оплату аренды выбранной машины"}
                                    isDisabled={!carsStore.selectedCarId}
                                    onClick={() =>
                                        filesStore.loadXml(`amount`, {
                                            car_number: carsStore.selectedCarId,
                                        })
                                    }
                                />
                            </Dropdown.Menu>
                        </Dropdown>
                    </ButtonToolbar>
                </Row>
                <Row>
                    <Col>
                        <Table<ICarResponse>
                            selectRowCallback={selectRowHandler}
                            columns={carsTableColumns}
                            data={carsStore.carsList}
                        />
                    </Col>
                </Row>
            </Container>

            <SuccessModal
                show={!!carsStore.successMessage}
                closeCallback={() => carsStore.clearSuccessMessage()}
                message={carsStore.successMessage}
            />
            <ErrorModal
                show={!!carsStore.errorMessage}
                closeCallback={() => carsStore.clearErrorMessage()}
                message={carsStore.errorMessage}
            />
        </>
    );
};

export default observer(Cars);
