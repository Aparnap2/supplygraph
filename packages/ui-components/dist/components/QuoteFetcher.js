import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search, CheckCircle, Clock, Users } from 'lucide-react';
import { cn } from '../utils/cn';
export const QuoteFetcher = ({ items, status, estimated_time, vendors_count }) => {
    const getStatusIcon = () => {
        switch (status) {
            case 'contacting_vendors':
                return _jsx(Users, { className: "h-5 w-5 animate-pulse" });
            case 'fetching':
                return _jsx(Search, { className: "h-5 w-5 animate-spin" });
            case 'completed':
                return _jsx(CheckCircle, { className: "h-5 w-5" });
            default:
                return _jsx(Clock, { className: "h-5 w-5" });
        }
    };
    const getStatusColor = () => {
        switch (status) {
            case 'contacting_vendors':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'fetching':
                return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'completed':
                return 'text-green-600 bg-green-50 border-green-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };
    const getStatusText = () => {
        switch (status) {
            case 'contacting_vendors':
                return 'Contacting vendors...';
            case 'fetching':
                return 'Fetching quotes...';
            case 'completed':
                return 'Quotes received';
            default:
                return 'Pending';
        }
    };
    return (_jsx("div", { className: cn("border rounded-lg p-4", getStatusColor()), children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-full bg-white", children: _jsx("div", { className: cn(status === 'contacting_vendors' && "text-blue-600", status === 'fetching' && "text-orange-600", status === 'completed' && "text-green-600"), children: getStatusIcon() }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium text-gray-900 mb-3", children: "Quote Request" }), _jsx("div", { className: "space-y-2 mb-4", children: items.map((item, index) => (_jsx("div", { className: "flex justify-between items-center p-2 bg-white bg-opacity-60 rounded", children: _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 text-sm", children: item.name }), _jsxs("p", { className: "text-xs text-gray-600", children: [item.quantity, " ", item.unit] })] }) }, index))) }), _jsxs("div", { className: "space-y-2 text-sm text-gray-600", children: [vendors_count && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "h-3 w-3" }), _jsxs("span", { children: ["Contacing ", vendors_count, " vendors"] })] })), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "h-3 w-3" }), _jsxs("span", { children: ["Estimated time: ", estimated_time] })] })] }), _jsx("div", { className: "mt-3 pt-3 border-t border-gray-200", children: _jsxs("span", { className: cn("inline-flex items-center gap-2 text-sm font-medium", status === 'contacting_vendors' && "text-blue-700", status === 'fetching' && "text-orange-700", status === 'completed' && "text-green-700"), children: [getStatusIcon(), getStatusText()] }) })] })] }) }));
};
