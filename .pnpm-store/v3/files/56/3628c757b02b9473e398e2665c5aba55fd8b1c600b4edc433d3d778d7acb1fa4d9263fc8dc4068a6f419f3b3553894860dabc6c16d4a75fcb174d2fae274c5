"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAnalytics = GoogleAnalytics;
exports.sendGAEvent = sendGAEvent;
const jsx_runtime_1 = require("react/jsx-runtime");
// TODO: Evaluate import 'client only'
const react_1 = require("react");
const script_1 = __importDefault(require("next/script"));
let currDataLayerName = undefined;
function GoogleAnalytics(props) {
    const { gaId, debugMode, dataLayerName = 'dataLayer', nonce } = props;
    if (currDataLayerName === undefined) {
        currDataLayerName = dataLayerName;
    }
    (0, react_1.useEffect)(() => {
        // performance.mark is being used as a feature use signal. While it is traditionally used for performance
        // benchmarking it is low overhead and thus considered safe to use in production and it is a widely available
        // existing API.
        // The performance measurement will be handled by Chrome Aurora
        performance.mark('mark_feature_usage', {
            detail: {
                feature: 'next-third-parties-ga',
            },
        });
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(script_1.default, { id: "_next-ga-init", dangerouslySetInnerHTML: {
                    __html: `
          window['${dataLayerName}'] = window['${dataLayerName}'] || [];
          function gtag(){window['${dataLayerName}'].push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}' ${debugMode ? ",{ 'debug_mode': true }" : ''});`,
                }, nonce: nonce }), (0, jsx_runtime_1.jsx)(script_1.default, { id: "_next-ga", src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`, nonce: nonce })] }));
}
function sendGAEvent(..._args) {
    if (currDataLayerName === undefined) {
        console.warn(`@next/third-parties: GA has not been initialized`);
        return;
    }
    if (window[currDataLayerName]) {
        window[currDataLayerName].push(arguments);
    }
    else {
        console.warn(`@next/third-parties: GA dataLayer ${currDataLayerName} does not exist`);
    }
}
