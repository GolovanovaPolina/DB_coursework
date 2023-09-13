import * as React from 'react';
import {FC} from 'react';
import {Alert} from "react-bootstrap";
import {IMessageModal} from "./ErrorModal";

const SuccessModal: FC<IMessageModal> = ({closeCallback, show, message, title}) => {
  if (!show) return null;
  return (
      <Alert className={"w-50 mx-auto"} variant="success" onClose={closeCallback} dismissible>
          <div className="d-flex align-items-center">
              <i className="big-icon bi-check2 me-3"> </i>
              <span >{message}
                </span>
          </div>
      </Alert>
  )
};

export default SuccessModal;