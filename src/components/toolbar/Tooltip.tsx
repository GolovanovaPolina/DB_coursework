import * as React from "react";
import {useEffect, useRef} from "react";
import {Tooltip as BsTooltip} from "bootstrap";

export const Tooltip = (p: { children: JSX.Element, text: string }) => {
    const childRef = useRef(undefined as unknown as Element)

    useEffect(() => {
        const t = new BsTooltip(childRef.current, {
            title: p.text,
            placement: "bottom",
            trigger: "hover",
        })
        return () => t.dispose()
    }, [p.text])

    return React.cloneElement(p.children, {ref: childRef})
}