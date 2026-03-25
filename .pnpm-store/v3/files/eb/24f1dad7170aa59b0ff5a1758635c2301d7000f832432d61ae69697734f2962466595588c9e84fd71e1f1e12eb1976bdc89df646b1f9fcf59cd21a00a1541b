"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = YouTubeEmbed;
const jsx_runtime_1 = require("react/jsx-runtime");
const script_1 = __importDefault(require("next/script"));
const third_party_capital_1 = require("third-party-capital");
const ThirdPartyScriptEmbed_1 = __importDefault(require("../ThirdPartyScriptEmbed"));
const scriptStrategy = {
    server: 'beforeInteractive',
    client: 'afterInteractive',
    idle: 'lazyOnload',
    worker: 'worker',
};
function YouTubeEmbed(props) {
    const { html, scripts, stylesheets } = (0, third_party_capital_1.YouTubeEmbed)(props);
    return ((0, jsx_runtime_1.jsx)(ThirdPartyScriptEmbed_1.default, { height: props.height || null, width: props.width || null, html: html, dataNtpc: "YouTubeEmbed", children: scripts === null || scripts === void 0 ? void 0 : scripts.map((script) => ((0, jsx_runtime_1.jsx)(script_1.default, { src: script.url, strategy: scriptStrategy[script.strategy], stylesheets: stylesheets }, script.url))) }));
}
