#!/usr/bin/env python3
"""
Korean AI Act Compliance Scanner
Searches for businesses and checks their website compliance.
"""
import asyncio
import os
from datetime import datetime
from typing import List, Dict, Any
from pathlib import Path

# Add parent to path for imports
import sys
sys.path.insert(0, str(Path(__file__).parent))

from browser_use import Agent
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()


def load_businesses_from_file(filepath: str = "revenue/leads_batch1.md") -> List[Dict[str, str]]:
    """Load businesses from leads file."""
    businesses = []
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Parse markdown table
        lines = content.strip().split('\n')
        for line in lines[2:]:  # Skip header and separator
            if '|' in line and not line.startswith('|---'):
                parts = [p.strip() for p in line.split('|')]
                if len(parts) >= 4:
                    businesses.append({
                        'name': parts[1],
                        'website': parts[2],
                        'phone': parts[3] if len(parts) > 3 else '',
                    })
    except FileNotFoundError:
        print(f"File not found: {filepath}")
    
    return businesses


async def check_compliance(url: str, llm) -> Dict[str, Any]:
    """Check a single website for compliance."""
    task = f"""Visit {url} and check for Korean AI Act compliance:

1. AI Disclosure: Look for AI, "AI-generated", "AI가 생성", machine learning mentions
2. Contact Info: Look for email, phone, "문의", "Contact"
3. Privacy Policy: Look for "privacy", "개인정보 처리방침"

Return a brief JSON report:
{{
    "ai_disclosure_found": true/false,
    "contact_info_found": true/false,
    "privacy_policy_found": true/false,
    "compliance_score": 0-100,
    "issues": ["issue1", "issue2"]
}}

If the site doesn't load, return error: true"""


    try:
        agent = Agent(task=task, llm=llm)
        result = await agent.run()
        
        return {
            "url": url,
            "result": str(result),
            "success": True
        }
    except Exception as e:
        return {
            "url": url,
            "error": str(e),
            "success": False
        }


async def scan_businesses(businesses: List[Dict[str, str]], max_concurrent: int = 3):
    """Scan multiple businesses for compliance."""
    
    # Initialize LLM
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("BROWSER_USE_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY or BROWSER_USE_API_KEY not set")
        return
    
    llm = ChatOpenAI(model="gpt-4o", api_key=api_key)
    
    results = []
    
    print(f"Scanning {len(businesses)} businesses...")
    
    for i, business in enumerate(businesses):
        website = business.get('website', '').strip()
        if not website:
            continue
            
        # Add https if missing
        if not website.startswith('http'):
            website = 'https://' + website
            
        print(f"[{i+1}/{len(businesses)}] Checking {business.get('name')} - {website}")
        
        result = await check_compliance(website, llm)
        result['business_name'] = business.get('name', '')
        results.append(result)
        
        # Rate limit
        await asyncio.sleep(2)
    
    return results


def generate_report(results: List[Dict[str, Any]], output_file: str = "compliance_report.md"):
    """Generate a markdown compliance report."""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"# Korean AI Act Compliance Report\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        f.write("## Summary\n\n")
        total = len(results)
        compliant = sum(1 for r in results if r.get('success'))
        f.write(f"- Total scanned: {total}\n")
        f.write(f"- Successful: {compliant}\n")
        f.write(f"- Failed: {total - compliant}\n\n")
        
        f.write("## Results\n\n")
        for r in results:
            f.write(f"### {r.get('business_name', 'Unknown')}\n")
            f.write(f"- URL: {r.get('url')}\n")
            if r.get('error'):
                f.write(f"- ❌ Error: {r['error']}\n")
            else:
                f.write(f"- ✅ Checked\n")
                if r.get('result'):
                    f.write(f"- Result: {r['result'][:500]}...\n")
            f.write("\n")
    
    print(f"Report saved to {output_file}")


async def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Korean AI Act Compliance Scanner')
    parser.add_argument('--file', '-f', default='revenue/leads_batch1.md', 
                        help='Input file with businesses')
    parser.add_argument('--output', '-o', default='compliance_report.md',
                        help='Output report file')
    parser.add_argument('--url', '-u', 
                        help='Single URL to check')
    args = parser.parse_args()
    
    if args.url:
        # Single URL mode
        api_key = os.getenv("OPENAI_API_KEY") or os.getenv("BROWSER_USE_API_KEY")
        llm = ChatOpenAI(model="gpt-4o", api_key=api_key)
        result = await check_compliance(args.url, llm)
        print(result)
    else:
        # Batch mode
        businesses = load_businesses_from_file(args.file)
        print(f"Loaded {len(businesses)} businesses")
        
        if businesses:
            results = await scan_businesses(businesses)
            generate_report(results, args.output)
        else:
            print("No businesses found. Create revenue/leads_batch1.md with business info.")


if __name__ == "__main__":
    asyncio.run(main())
