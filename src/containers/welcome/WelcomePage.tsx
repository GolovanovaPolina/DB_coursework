import React from "react";
import {Container} from "react-bootstrap";
import {NavMenu} from "../../components/Navigation";

export type WelcomePageProps = {};
export const WelcomePage: React.FC<WelcomePageProps> = ({}) => {
    const text = "Добро пожаловать!";

    return (
        <Container className={"welcome-page"} fluid>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <h1 className={"welcome-header"}>{text}</h1>
                <NavMenu />
            </div>
        </Container>
    );
};
