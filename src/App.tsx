import {observer} from "mobx-react-lite";
import React from "react";
import {BrowserRouter} from "react-router-dom";

const App = () => {
    return (
        <BrowserRouter>
            {/*<Routes>
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
            </Routes>*/}
            <div>
                Hello!
            </div>
        </BrowserRouter>
    );
};

export default observer(App);
