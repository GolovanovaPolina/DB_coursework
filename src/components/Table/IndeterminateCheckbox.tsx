import {forwardRef, MutableRefObject, useEffect, useRef} from "react";
import {TableToggleAllRowsSelectedProps} from "react-table";

export const IndeterminateCheckbox = forwardRef(
    (
        {indeterminate, ...rest}: Partial<TableToggleAllRowsSelectedProps>,
        ref
    ) => {
        const defaultRef = useRef<HTMLInputElement | null>(null)
        const resolvedRef =
            (ref as MutableRefObject<HTMLInputElement | null>) || defaultRef

        useEffect(() => {
            if (resolvedRef.current) {
                resolvedRef.current.indeterminate = indeterminate as boolean
            }
        }, [resolvedRef, indeterminate])

        return <input type='checkbox' ref={resolvedRef} {...rest} />
    }
)