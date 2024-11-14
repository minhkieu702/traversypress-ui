import React from "react";
import { FilterXSS, getDefaultWhiteList } from "xss";

import { richTextToHtml } from "@/lib/editor";
import { JSONContent } from "@tiptap/core";
import { ScriptFormatter } from "./script-formatter";

const whitelist = getDefaultWhiteList();
// Style attribute should still be safe from xss, just saves compute time on other elements
whitelist.mark?.push("style");

const xss = new FilterXSS({
    whiteList: whitelist,
    // onIgnoreTagAttr: function (_tag, name, value) {
    //   if (name.substring(0, 5) === 'data-') {
    //     return `${name}="${escapeAttrValue(value)}"`
    //   }
    // }
});

export const Display: React.FC<{
    text: string;
    richText?: JSON | JSONContent | null;
}> = ({ text, richText }) => {
    return richText ? (
        <p
            dangerouslySetInnerHTML={{
                __html: xss.process(
                    richTextToHtml(richText as JSONContent, true)
                ),
            }}
        />
    ) : (
        <ScriptFormatter>{text}</ScriptFormatter>
    );
};
