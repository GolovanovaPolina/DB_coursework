import {Link, Outlet} from "react-router-dom";
import {Container, Nav, Navbar} from "react-bootstrap";
import car from "../../assets/car.png";
import {FC} from "react";

export const NavMenu = () => (
    <Nav variant="pills">
        <Nav.Item as="li" className="fw-semibold">
            <Nav.Link eventKey={"link-1"} as={Link} to="/boxes">
                Боксы
            </Nav.Link>
        </Nav.Item>
        <Nav.Item as="li" className="fw-semibold">
            <Nav.Link eventKey={"link-2"} as={Link} to="/clients">
                Клиенты
            </Nav.Link>
        </Nav.Item>

        <Nav.Item as="li" className="fw-semibold">
            <Nav.Link eventKey={"link-3"} as={Link} to="/cars">
                Автомобили
            </Nav.Link>
        </Nav.Item>

        <Nav.Item as="li" className="fw-semibold">
            <Nav.Link eventKey={"link-4"} as={Link} to="/new-rent">
                Новое бронирование
            </Nav.Link>
        </Nav.Item>
        <Nav.Item as="li" className="fw-semibold">
            <Nav.Link eventKey={"link-5"} as={Link} to="/statistics">
                Статистика
            </Nav.Link>
        </Nav.Item>
    </Nav>
);

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
