// @flow
import * as React from 'react';
import {memo} from 'react';
import {Tooltip} from "./Tooltip";
import {Button, ButtonToolbar, Dropdown} from "react-bootstrap";
import {FileMenuItem, FileMenuItemProps} from "./FileMenuItem";

export interface ButtonData {
    name: string,
    tooltip: string,
    variant: string,
    onClick: () => void;
    disabled?: boolean;
    icon: string
}


type ToolbarData = {
    buttons: ButtonData[];
    fileButtons: FileMenuItemProps[];
};


function Toolbar({buttons, fileButtons}: ToolbarData) {

    return (
        <ButtonToolbar>
            {buttons.map((btn, index) =>
                <Tooltip text={btn.name} key={index}>
                    <Button role={"button"} aria-label={btn.name} variant={btn.variant} className="me-2"
                            onClick={btn.onClick} disabled={btn.disabled}
                    >
                        <i className={btn.icon}></i>
                    </Button>
                </Tooltip>
            )}

            <Dropdown>
                <Tooltip text="Получить справку">
                    <Dropdown.Toggle variant="outline-dark" className="me-2" aria-label={"Получить справку"}>
                        <i className="bi bi-filetype-xls"></i>
                    </Dropdown.Toggle>
                </Tooltip>

                <Dropdown.Menu className={"mt-1"} role={"menu"}>
                    {fileButtons.map((btn, index) =>
                        <FileMenuItem key={index} onClick={btn.onClick} title={btn.title} isDisabled={btn.isDisabled}/>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </ButtonToolbar>
    );
}

export default memo(Toolbar);