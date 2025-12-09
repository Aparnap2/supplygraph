import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Package, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '../utils/cn';
export const InventoryCheck = ({ items, status }) => {
    const getStatusIcon = () => {
        switch (status) {
            case 'checking':
                return _jsx(Clock, { className: "h-5 w-5 text-blue-600" });
            case 'completed':
                return _jsx(CheckCircle, { className: "h-5 w-5 text-green-600" });
            case 'unavailable':
                return _jsx(AlertTriangle, { className: "h-5 w-5 text-red-600" });
            default:
                return _jsx(Package, { className: "h-5 w-5 text-gray-600" });
        }
    };
    const getStatusColor = () => {
        switch (status) {
            case 'checking':
                return 'bg-blue-50 border-blue-200';
            case 'completed':
                return 'bg-green-50 border-green-200';
            case 'unavailable':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };
    const getStatusText = () => {
        switch (status) {
            case 'checking':
                return 'Checking inventory...';
            case 'completed':
                return 'All items available';
            case 'unavailable':
                return 'Some items unavailable';
            default:
                return 'Status unknown';
        }
    };
    return (_jsx("div", { className: cn("border rounded-lg p-4", getStatusColor()), children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-full bg-white", children: getStatusIcon() }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium text-gray-900 mb-3", children: "Inventory Check" }), _jsx("div", { className: "space-y-2 mb-4", children: items.map((item, index) => (_jsxs("div", { className: "flex justify-between items-center p-2 bg-white bg-opacity-60 rounded", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 text-sm", children: item.name }), _jsxs("p", { className: "text-xs text-gray-600", children: [item.quantity, " ", item.unit] }), item.specifications && (_jsx("p", { className: "text-xs text-gray-500 mt-1", children: item.specifications }))] }), item.category && (_jsx("span", { className: "text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded", children: item.category }))] }, index))) }), _jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-gray-200", children: [_jsxs("span", { className: cn("inline-flex items-center gap-2 text-sm font-medium", status === 'checking' && "text-blue-700", status === 'completed' && "text-green-700", status === 'unavailable' && "text-red-700"), children: [getStatusIcon(), getStatusText()] }), _jsxs("span", { className: "text-xs text-gray-500", children: [items.length, " item", items.length !== 1 ? 's' : '', " checked"] })] })] })] }) }));
};
