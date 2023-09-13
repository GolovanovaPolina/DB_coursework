import * as React from 'react';
import {FC} from 'react';
import {Modal} from "react-bootstrap";


interface IReceiptModal {
    show: boolean;
    renterId: string;
}

export const ReceiptModal:FC<IReceiptModal> = ({renterId, show}) =>  {
    // запрос за всеми машинами человека.
    return (
        <Modal show={show}>

            <Table></Table>
        </Modal>
    );
};