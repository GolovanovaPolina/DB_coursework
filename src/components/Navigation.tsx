import {Link, Outlet} from "react-router-dom";
import {Container, Nav, Navbar} from "react-bootstrap";
import car from "../../assets/car.png";
import {FC} from "react";

export interface ISection {
    text: string;
    url: string;
}

export const menu: ISection[] = [
    {
        text: "Боксы",
        url: "/boxes"
    },
    {
        text: "Клиенты",
        url: "/clients"
    },
    {
        text: "Автомобили",
        url: "/cars"
    },
    {
        text: "Новое бронирование",
        url: "/new-rent"
    },
    {
        text: "Статистика",
        url: "/statistics"
    },
]

export const NavMenu = () => {
    return (
        <Nav variant="pills">
            {menu.map((m, index) =>
                <Nav.Item as="li" className="fw-semibold" key={index}>
                    <Nav.Link eventKey={"link-1"} as={Link} to={m.url}>
                        {m.text}
                    </Nav.Link>
            </Nav.Item>)}
        </Nav>
    );
};

interface INavigation {
    isShowMenu: boolean;
}

export const Navigation: FC<INavigation> = ({ isShowMenu }) => {
    return (
        <>
            <Navbar>
                <Container>
                    <Navbar.Brand href={"/"}>
                        <img alt={"logo"} src={car} height={50} className="me-3" />
                        <span className="text-uppercase fw-semibold">твой гараж</span>
                    </Navbar.Brand>
                    {isShowMenu && <NavMenu />}
                </Container>
            </Navbar>
            <Outlet />
        </>
    );
};
