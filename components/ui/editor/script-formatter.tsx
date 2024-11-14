/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { formatScripts } from "./scripts";

export const ScriptFormatter = ({ children }: { children: string }) => {
    const formatted = useMemo(() => formatScripts(children), [children]);

    return (
        <>
            {formatted.map((item: any, index: number) => (
                <React.Fragment key={index}>
                    {item.sub ? (
                        <sub>{item.value}</sub>
                    ) : item.super ? (
                        <sup>{item.value}</sup>
                    ) : (
                        item.value
                    )}
                </React.Fragment>
            ))}
        </>
    );
};
