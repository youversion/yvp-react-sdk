"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouVersionLoginButton = void 0;
var react_1 = __importDefault(require("react"));
var loginButtonUrl = 'https://github.com/youversion/yvp-sdks/blob/main/shared-assets/roundedButton-dark.png?raw=true';
var YouVersionLoginButton = function (_a) {
    var onClick = _a.onClick;
    return (react_1.default.createElement("img", { src: loginButtonUrl, alt: "Sign in with YouVersion", onClick: onClick, style: { cursor: 'pointer', width: '200px' } }));
};
exports.YouVersionLoginButton = YouVersionLoginButton;
