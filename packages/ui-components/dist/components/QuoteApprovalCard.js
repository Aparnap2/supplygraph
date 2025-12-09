import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Check, X, Clock, Package, Calendar } from 'lucide-react';
import { cn } from '../utils/cn';
export const QuoteApprovalCard = ({ vendor, items, total_amount, savings, delivery_time, quote_id, org_id, valid_until }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const handleApprove = async () => {
        setIsProcessing(true);
        try {
            // Call API to approve and resume workflow
            const response = await fetch('/api/workflow/resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    thread_id: quote_id,
                    action: 'approve',
                    data: {
                        approved_quote_id: quote_id,
                        org_id,
                    }
                })
            });
            if (response.ok) {
                console.log('Quote approved successfully');
            }
            else {
                console.error('Failed to approve quote');
            }
        }
        catch (error) {
            console.error('Error approving quote:', error);
        }
        finally {
            setIsProcessing(false);
        }
    };
    const handleReject = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/workflow/resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    thread_id: quote_id,
                    action: 'reject',
                    data: {
                        rejected_quote_id: quote_id,
                        reason: 'User rejected'
                    }
                })
            });
            if (response.ok) {
                console.log('Quote rejected successfully');
            }
            else {
                console.error('Failed to reject quote');
            }
        }
        catch (error) {
            console.error('Error rejecting quote:', error);
        }
        finally {
            setIsProcessing(false);
        }
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };
    return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-2xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Quote for Approval" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Vendor: ", vendor] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: formatCurrency(total_amount) }), savings && (_jsxs("div", { className: "text-sm text-green-600", children: ["Save ", savings, " compared to other quotes"] }))] })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("h4", { className: "text-sm font-medium text-gray-900 mb-3 flex items-center gap-2", children: [_jsx(Package, { className: "h-4 w-4" }), "Items (", items.length, ")"] }), _jsx("div", { className: "space-y-2", children: items.map((item, index) => (_jsxs("div", { className: "flex justify-between items-center p-3 bg-gray-50 rounded", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: item.name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Quantity: ", item.quantity] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-medium text-gray-900", children: [formatCurrency(item.unit_price), " each"] }), _jsxs("p", { className: "text-sm text-gray-600", children: [formatCurrency(item.total_price), " total"] })] })] }, index))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsxs("span", { children: ["Delivery: ", delivery_time] })] }), valid_until && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsxs("span", { children: ["Valid until: ", new Date(valid_until).toLocaleDateString()] })] }))] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: handleApprove, disabled: isProcessing, className: cn("flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors", isProcessing
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"), children: [_jsx(Check, { className: "h-4 w-4" }), isProcessing ? 'Processing...' : 'Approve Quote'] }), _jsxs("button", { onClick: handleReject, disabled: isProcessing, className: cn("flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors border", isProcessing
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            : "bg-white text-red-600 border-red-300 hover:bg-red-50"), children: [_jsx(X, { className: "h-4 w-4" }), isProcessing ? 'Processing...' : 'Reject Quote'] })] })] }));
};
