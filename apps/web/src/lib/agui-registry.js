"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultComponent = exports.AGUI_COMPONENT_REGISTRY = void 0;
exports.getAGUIComponent = getAGUIComponent;
const react_1 = __importDefault(require("react"));
const ui_components_1 = require("@supplygraph/ui-components");
// AGUI Component Registry - maps component names to React components
exports.AGUI_COMPONENT_REGISTRY = {
    'thinking_loader': ui_components_1.ThinkingLoader,
    'inventory_check': ui_components_1.InventoryCheck,
    'quote_fetcher': ui_components_1.QuoteFetcher,
    'quote_approval_card': ui_components_1.QuoteApprovalCard,
    'payment_processor': ui_components_1.PaymentProcessor,
    'payment_success': ui_components_1.PaymentSuccess,
    'error_card': ui_components_1.ErrorCard,
};
// Default fallback component for unknown components
const DefaultComponent = ({ message }) => (react_1.default.createElement("div", { className: "p-4 bg-muted rounded-lg" }, message));
exports.DefaultComponent = DefaultComponent;
function getAGUIComponent(componentName) {
    return exports.AGUI_COMPONENT_REGISTRY[componentName] || exports.DefaultComponent;
}
