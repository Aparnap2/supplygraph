import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
export const PaymentProcessor = ({ status, amount, vendor, payment_method }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    const getStatusIcon = () => {
        switch (status) {
            case 'processing_payment':
                return _jsx(Loader2, { className: "h-5 w-5 animate-spin" });
            case 'payment_complete':
                return _jsx(CheckCircle, { className: "h-5 w-5" });
            case 'payment_failed':
                return _jsx(AlertCircle, { className: "h-5 w-5" });
            default:
                return _jsx(CreditCard, { className: "h-5 w-5" });
        }
    };
    const getStatusColor = () => {
        switch (status) {
            case 'processing_payment':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'payment_complete':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'payment_failed':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };
    const getStatusText = () => {
        switch (status) {
            case 'processing_payment':
                return 'Processing payment...';
            case 'payment_complete':
                return 'Payment completed successfully';
            case 'payment_failed':
                return 'Payment failed';
            default:
                return 'Payment pending';
        }
    };
    return (_jsx("div", { className: cn("border rounded-lg p-5", getStatusColor()), children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: cn("p-3 rounded-full", status === 'processing_payment' && "bg-blue-100", status === 'payment_complete' && "bg-green-100", status === 'payment_failed' && "bg-red-100"), children: _jsx("div", { className: cn(status === 'processing_payment' && "text-blue-600", status === 'payment_complete' && "text-green-600", status === 'payment_failed' && "text-red-600"), children: getStatusIcon() }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "mb-3", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-1", children: formatCurrency(amount) }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Payment to ", vendor] }), payment_method && (_jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Method: ", payment_method] }))] }), _jsx("div", { className: "pt-3 border-t border-gray-200", children: _jsx("span", { className: cn("inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full", status === 'processing_payment' && "bg-blue-100 text-blue-800", status === 'payment_complete' && "bg-green-100 text-green-800", status === 'payment_failed' && "bg-red-100 text-red-800"), children: getStatusText() }) })] })] }) }));
};
