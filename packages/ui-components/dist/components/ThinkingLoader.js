import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2, Brain, Search, CheckCircle } from 'lucide-react';
export const ThinkingLoader = ({ status, stage, progress }) => {
    const getStageIcon = () => {
        switch (stage) {
            case 'parsing':
                return _jsx(Loader2, { className: "h-5 w-5" });
            case 'analyzing':
                return _jsx(Brain, { className: "h-5 w-5" });
            case 'fetching':
                return _jsx(Search, { className: "h-5 w-5" });
            case 'processing':
                return _jsx(CheckCircle, { className: "h-5 w-5" });
            default:
                return _jsx(Loader2, { className: "h-5 w-5" });
        }
    };
    const getStageText = () => {
        switch (stage) {
            case 'parsing':
                return 'Parsing your request...';
            case 'analyzing':
                return 'Analyzing requirements...';
            case 'fetching':
                return 'Fetching vendor quotes...';
            case 'processing':
                return 'Processing your data...';
            default:
                return status;
        }
    };
    return (_jsxs("div", { className: "flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg", children: [_jsx("div", { className: "flex-shrink-0 text-blue-600 animate-spin", children: getStageIcon() }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-blue-900", children: getStageText() }), status && (_jsx("p", { className: "text-xs text-blue-700 mt-1", children: status }))] }), progress !== undefined && (_jsxs("div", { className: "flex-shrink-0", children: [_jsxs("div", { className: "text-sm font-medium text-blue-900", children: [Math.round(progress), "%"] }), _jsx("div", { className: "w-16 h-2 bg-blue-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-blue-500 transition-all duration-300 ease-out", style: { width: `${progress}%` } }) })] }))] }));
};
