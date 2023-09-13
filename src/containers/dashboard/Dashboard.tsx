import React, {useEffect} from "react";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Colors,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import {observer} from "mobx-react-lite";
import {useStores} from "../../store/RootStore";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {Col, Row} from "react-bootstrap";
import {Bar} from "react-chartjs-2";
import {InfoBlock} from "./InfoBlock";

ChartJS.register(ArcElement, Tooltip, Legend, Colors, ChartDataLabels, Title, CategoryScale, LinearScale, BarElement);

export type DashboardProps = {};

const Dashboard: React.FC<DashboardProps> = ({}) => {
    const { chartBarStore } = useStores();

    useEffect(() => {
        chartBarStore.loadData();
    }, []);

    return (
        <Row className={"align-items-center"} style={{ height: "80vh" }}>
            <Col xs={{ span: 5, offset: 1 }}>
                <Bar options={chartBarStore.options} data={chartBarStore.data}></Bar>
            </Col>
            <Col xs={{ span: 3, offset: 1 }}>
                <InfoBlock desc={"Всего боксов"} count={chartBarStore.totalBoxNumber} />
                <InfoBlock desc={"Свободно"} count={`${chartBarStore.freeBoxPercent}%`} />
                <InfoBlock desc={"Всего автомобилей"} count={chartBarStore.totalCarNumber} />
            </Col>
        </Row>
    );
};

export default observer(Dashboard);
