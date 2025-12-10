"""Docling service for document processing and quote extraction."""

from typing import Dict, Any, List, Optional, Union
import tempfile
import os

import structlog
from docling.document_converter import DocumentConverter
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions

logger = structlog.get_logger(__name__)


class DoclingService:
    """Service for processing documents using Docling."""
    
    def __init__(self):
        # Configure Docling pipeline options
        pipeline_options = PdfPipelineOptions()
        pipeline_options.do_ocr = True
        pipeline_options.do_table_structure = True
        
        self.converter = DocumentConverter(
            format_options={
                InputFormat.PDF: pipeline_options,
            }
        )
    
    async def process_document(
        self,
        document_content: bytes,
        filename: str,
        content_type: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Process a document and extract structured content."""
        try:
            logger.info("Processing document", filename=filename, size=len(document_content))
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=self._get_file_extension(filename)) as temp_file:
                temp_file.write(document_content)
                temp_file_path = temp_file.name
            
            try:
                # Convert document using Docling
                result = self.converter.convert(temp_file_path)
                
                # Extract structured data
                document_data = {
                    "filename": filename,
                    "content_type": content_type,
                    "text": result.document.export_to_text(),
                    "markdown": result.document.export_to_markdown(),
                    "tables": self._extract_tables(result.document),
                    "metadata": {
                        "page_count": len(result.document.pages) if hasattr(result.document, 'pages') else 1,
                        "processing_status": "success",
                    }
                }
                
                logger.info(
                    "Document processed successfully",
                    filename=filename,
                    page_count=document_data["metadata"]["page_count"],
                    text_length=len(document_data["text"]),
                )
                
                return document_data
                
            finally:
                # Clean up temporary file
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
                    
        except Exception as e:
            logger.error("Failed to process document", filename=filename, error=str(e))
            return {
                "filename": filename,
                "content_type": content_type,
                "text": "",
                "markdown": "",
                "tables": [],
                "metadata": {
                    "processing_status": "failed",
                    "error": str(e),
                }
            }
    
    async def extract_quote_data(self, document_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract quote-specific data from processed document."""
        text = document_data.get("text", "")
        tables = document_data.get("tables", [])
        
        # Extract quote information using text analysis and table data
        quote_data = {
            "vendor_info": self._extract_vendor_info(text),
            "items": self._extract_items_from_tables(tables) or self._extract_items_from_text(text),
            "pricing": self._extract_pricing_info(text, tables),
            "terms": self._extract_terms_and_conditions(text),
            "delivery": self._extract_delivery_info(text),
        }
        
        return quote_data
    
    def _get_file_extension(self, filename: str) -> str:
        """Get file extension from filename."""
        _, ext = os.path.splitext(filename)
        return ext.lower() if ext else '.pdf'
    
    def _extract_tables(self, document) -> List[Dict[str, Any]]:
        """Extract tables from Docling document."""
        tables = []
        
        try:
            # Extract tables if available
            if hasattr(document, 'tables'):
                for table in document.tables:
                    table_data = {
                        "headers": [],
                        "rows": [],
                        "raw_data": str(table) if table else "",
                    }
                    
                    # Try to extract structured table data
                    if hasattr(table, 'data'):
                        # Process table data structure
                        pass
                    
                    tables.append(table_data)
                    
        except Exception as e:
            logger.warning("Failed to extract tables", error=str(e))
        
        return tables
    
    def _extract_vendor_info(self, text: str) -> Dict[str, Any]:
        """Extract vendor information from text."""
        import re
        
        vendor_info = {}
        
        # Extract email addresses
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            vendor_info["email"] = emails[0]
        
        # Extract phone numbers
        phone_pattern = r'(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        phones = re.findall(phone_pattern, text)
        if phones:
            vendor_info["phone"] = f"({phones[0][0]}) {phones[0][1]}-{phones[0][2]}"
        
        # Extract company name (heuristic approach)
        lines = text.split('\n')[:10]  # Check first 10 lines
        for line in lines:
            line = line.strip()
            if line and len(line) > 3 and not any(char.isdigit() for char in line[:5]):
                # Likely a company name
                vendor_info["name"] = line
                break
        
        return vendor_info
    
    def _extract_items_from_tables(self, tables: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Extract items from table data."""
        items = []
        
        for table in tables:
            # Look for tables that might contain item information
            raw_data = table.get("raw_data", "").lower()
            if any(keyword in raw_data for keyword in ["item", "product", "description", "qty", "price"]):
                # This table likely contains items
                # TODO: Implement proper table parsing
                pass
        
        return items
    
    def _extract_items_from_text(self, text: str) -> List[Dict[str, Any]]:
        """Extract items from plain text using pattern matching."""
        import re
        
        items = []
        
        # Look for item patterns in text
        # This is a simplified implementation
        lines = text.split('\n')
        
        for line in lines:
            # Look for lines that might contain item information
            if re.search(r'\d+.*\$\d+', line):  # Line with quantity and price
                # Try to extract item info
                item = {
                    "name": line.strip(),
                    "description": "",
                    "quantity": 1,
                    "unit_price": 0.0,
                    "total_price": 0.0,
                }
                
                # Extract price
                price_match = re.search(r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)', line)
                if price_match:
                    price_str = price_match.group(1).replace(',', '')
                    item["unit_price"] = float(price_str)
                
                # Extract quantity
                qty_match = re.search(r'(\d+)\s*(?:x|qty|quantity)', line, re.IGNORECASE)
                if qty_match:
                    item["quantity"] = int(qty_match.group(1))
                
                item["total_price"] = item["unit_price"] * item["quantity"]
                items.append(item)
        
        return items
    
    def _extract_pricing_info(self, text: str, tables: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Extract pricing information."""
        import re
        
        pricing = {
            "subtotal": 0.0,
            "tax": 0.0,
            "shipping": 0.0,
            "total_amount": 0.0,
            "currency": "USD",
        }
        
        # Look for total amount
        total_patterns = [
            r'total[:\s]*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
            r'amount[:\s]*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
            r'grand\s+total[:\s]*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
        ]
        
        for pattern in total_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                amount_str = match.group(1).replace(',', '')
                pricing["total_amount"] = float(amount_str)
                break
        
        return pricing
    
    def _extract_terms_and_conditions(self, text: str) -> Dict[str, Any]:
        """Extract terms and conditions."""
        terms = {
            "payment_terms": "",
            "delivery_time": "",
            "warranty": "",
            "conditions": [],
        }
        
        # Look for payment terms
        payment_patterns = [
            r'payment\s+terms?[:\s]*([^\n]+)',
            r'net\s+(\d+)\s+days?',
            r'(\d+)%\s+(?:discount|off)',
        ]
        
        for pattern in payment_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                terms["payment_terms"] = match.group(0)
                break
        
        return terms
    
    def _extract_delivery_info(self, text: str) -> Dict[str, Any]:
        """Extract delivery information."""
        delivery = {
            "days": 0,
            "method": "",
            "cost": 0.0,
        }
        
        # Look for delivery time
        delivery_patterns = [
            r'delivery[:\s]*(\d+)\s*(?:days?|weeks?)',
            r'ship(?:ping)?[:\s]*(\d+)\s*(?:days?|weeks?)',
            r'lead\s+time[:\s]*(\d+)\s*(?:days?|weeks?)',
        ]
        
        for pattern in delivery_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                days = int(match.group(1))
                if "week" in match.group(0).lower():
                    days *= 7
                delivery["days"] = days
                break
        
        return delivery