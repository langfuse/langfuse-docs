"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ThirdPartyScriptEmbed;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function ThirdPartyScriptEmbed({ html, height = null, width = null, children, dataNtpc = '', }) {
    (0, react_1.useEffect)(() => {
        if (dataNtpc) {
            // performance.mark is being used as a feature use signal. While it is traditionally used for performance
            // benchmarking it is low overhead and thus considered safe to use in production and it is a widely available
            // existing API.
            performance.mark('mark_feature_usage', {
                detail: {
                    feature: `next-third-parties-${dataNtpc}`,
                },
            });
        }
    }, [dataNtpc]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [children, html ? ((0, jsx_runtime_1.jsx)("div", { style: {
                    height: height != null ? `${height}px` : 'auto',
                    width: width != null ? `${width}px` : 'auto',
                }, "data-ntpc": dataNtpc, dangerouslySetInnerHTML: { __html: html } })) : null] }));
}
