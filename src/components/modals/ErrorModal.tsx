import * as React from 'react';
import {FC} from 'react';
import {Alert} from "react-bootstrap";

export interface IMessageModal {
    show: boolean;
    closeCallback: () => void;
    message: string;
    title?: string;
}

const ErrorModal: FC<IMessageModal> = ({closeCallback, show, message, title}) => {
    if (!show) return null;
    return (
        <Alert className={"w-50 mx-auto"} variant="danger" onClose={closeCallback} dismissible>
            <div className="d-flex align-items-center">
                <i className="big-icon bi-exclamation-octagon me-3"> </i>
                <span >{message}
                </span>
            </div>

        </Alert>
    )
        ;
};

export default ErrorModal;