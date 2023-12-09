import React, {useEffect} from "react";
import {Col, Container, Row} from "react-bootstrap";
import Table from "../../components/table/Table";
import {ICarResponse} from "../../types/types";
import {carsTableColumns} from "../../data/data";
import SuccessModal from "../../components/modals/SuccessModal";
import ErrorModal from "../../components/modals/ErrorModal";
import {useStores} from "../../store/RootStore";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {FileMenuItemProps} from "../../components/toolbar/FileMenuItem";
import Toolbar, {ButtonData} from "../../components/toolbar/Toolbar";


export type CarsProps = {};
const Cars: React.FC<CarsProps> = ({}) => {
    const { carsStore, filesStore } = useStores();
    const navigate = useNavigate();

    useEffect(() => {
        carsStore.loadAll();
    }, []);


    function selectRowHandler(index: number) {
        carsStore.setSelectedCar(index);
    }

    function createCarHandler() {
        navigate("/new-rent");
    }

    const buttons: ButtonData[] = [
        {
            name: "Новый автомобиль",
            tooltip: "Новый автомобиль",
            onClick: createCarHandler,
            icon: "bi-plus-lg",
            variant: "success"
        },
        {
            name: "Удалить автомобиль из бокса",
            tooltip: "Удалить выбранный автомобиль из бокса",
            disabled: carsStore.selectedCarId === null,
            onClick: carsStore.deleteSelectedCar,
            icon: "bi-trash",
            variant: "danger"
        },

    ];

    const fileButtons: FileMenuItemProps[] = [
        {
            onClick: () => filesStore.loadXml(`amount`, {
                car_number: carsStore.selectedCarId,
            }),
            isDisabled: carsStore.selectedCarId === null,
            title: "Квитанция на оплату аренды выбранной машины",
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
