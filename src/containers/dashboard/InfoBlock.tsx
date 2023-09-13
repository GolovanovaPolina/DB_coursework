import React, {FC} from "react";

interface IInfoBlock {
    desc: string;
    count: number | string;
}

export const InfoBlock: FC<IInfoBlock> = ({ desc, count }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/*<hr className={"w-50"} />*/}
            <span>{desc}</span>
            <p style={{ fontSize: "40px", marginBottom: "1em" }}>{count}</p>
        </div>
    );
};
