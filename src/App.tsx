import {observer} from "mobx-react-lite";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Navigation} from "./components/navigation/Navigation";
import {WelcomePage} from "./containers/welcome/WelcomePage";
import Boxes from "./containers/boxes/Boxes";
import Clients from "./containers/clients/Clients";
import Cars from "./containers/cars/Cars";
import NewRent from "./containers/new_rent/NewRent";
import Dashboard from "./containers/dashboard/Dashboard";

const App = () => {
    return (
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigation isShowMenu={false} />}>
                        <Route path="/" element={<WelcomePage />} />
                    </Route>
                    <Route path="/" element={<Navigation isShowMenu={true} />}>
                        <Route path="boxes" element={<Boxes />} />
                        <Route path="clients" element={<Clients />} />
                        <Route path="cars" element={<Cars />} />
                        <Route path="new-rent" element={<NewRent />} />
                        <Route path="statistics" element={<Dashboard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
};

export default observer(App);
