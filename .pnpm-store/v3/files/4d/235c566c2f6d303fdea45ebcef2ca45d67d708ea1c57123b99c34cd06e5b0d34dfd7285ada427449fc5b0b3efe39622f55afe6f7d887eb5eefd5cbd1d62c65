"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GoogleMapsEmbed;
const jsx_runtime_1 = require("react/jsx-runtime");
const third_party_capital_1 = require("third-party-capital");
const ThirdPartyScriptEmbed_1 = __importDefault(require("../ThirdPartyScriptEmbed"));
function GoogleMapsEmbed(props) {
    const { apiKey, ...restProps } = props;
    const formattedProps = { ...restProps, key: apiKey };
    const { html } = (0, third_party_capital_1.GoogleMapsEmbed)(formattedProps);
    return ((0, jsx_runtime_1.jsx)(ThirdPartyScriptEmbed_1.default, { height: formattedProps.height || null, width: formattedProps.width || null, html: html, dataNtpc: "GoogleMapsEmbed" }));
}
