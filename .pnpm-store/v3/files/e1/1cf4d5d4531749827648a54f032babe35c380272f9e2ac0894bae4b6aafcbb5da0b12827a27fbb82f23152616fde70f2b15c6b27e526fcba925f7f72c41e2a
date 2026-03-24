"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGTMEvent = void 0;
exports.GoogleTagManager = GoogleTagManager;
const jsx_runtime_1 = require("react/jsx-runtime");
// TODO: Evaluate import 'client only'
const react_1 = require("react");
const script_1 = __importDefault(require("next/script"));
let currDataLayerName = 'dataLayer';
function GoogleTagManager(props) {
    const { gtmId, gtmScriptUrl, dataLayerName = 'dataLayer', auth, preview, dataLayer, nonce, } = props;
    currDataLayerName = dataLayerName;
    const scriptUrl = new URL(gtmScriptUrl || 'https://www.googletagmanager.com/gtm.js');
    if (gtmId) {
        scriptUrl.searchParams.set('id', gtmId);
    }
    if (dataLayerName !== 'dataLayer') {
        scriptUrl.searchParams.set('l', dataLayerName);
    }
    if (auth) {
        scriptUrl.searchParams.set('gtm_auth', auth);
    }
    if (preview) {
        scriptUrl.searchParams.set('gtm_preview', preview);
        scriptUrl.searchParams.set('gtm_cookies_win', 'x');
    }
    (0, react_1.useEffect)(() => {
        // performance.mark is being used as a feature use signal. While it is traditionally used for performance
        // benchmarking it is low overhead and thus considered safe to use in production and it is a widely available
        // existing API.
        // The performance measurement will be handled by Chrome Aurora
        performance.mark('mark_feature_usage', {
            detail: {
                feature: 'next-third-parties-gtm',
            },
        });
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(script_1.default, { id: "_next-gtm-init", dangerouslySetInnerHTML: {
                    __html: `
      (function(w,l){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
        ${dataLayer ? `w[l].push(${JSON.stringify(dataLayer)})` : ''}
      })(window,'${dataLayerName}');`,
                }, nonce: nonce }), (0, jsx_runtime_1.jsx)(script_1.default, { id: "_next-gtm", "data-ntpc": "GTM", src: scriptUrl.href, nonce: nonce })] }));
}
const sendGTMEvent = (data, dataLayerName) => {
    // special case if we are sending events before GTM init and we have custom dataLayerName
    const dataLayer = dataLayerName || currDataLayerName;
    // define dataLayer so we can still queue up events before GTM init
    window[dataLayer] = window[dataLayer] || [];
    window[dataLayer].push(data);
};
exports.sendGTMEvent = sendGTMEvent;
