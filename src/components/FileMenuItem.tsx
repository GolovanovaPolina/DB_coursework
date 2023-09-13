import React from "react";
import {Dropdown} from "react-bootstrap";

export interface FileMenuItemProps {
    title: string;
    onClick: () => Promise<void> | void;
    isDisabled?: boolean;
}
export const FileMenuItem: React.FC<FileMenuItemProps> = ({ title, onClick, isDisabled }) => {
    return (
        <Dropdown.Item onClick={onClick} disabled={isDisabled}>
            <span className="py-2 px-2">
                <i className="bi-download me-3"></i>
                {title}
            </span>
        </Dropdown.Item>
    );
};
