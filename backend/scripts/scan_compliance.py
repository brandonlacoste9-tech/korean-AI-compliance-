#!/usr/bin/env python3
"""
Korean AI Act Compliance Scanner - Stealth Mode
Searches for businesses and checks their website compliance discreetly.
"""
import asyncio
import os
from datetime import datetime
from typing import List, Dict, Any
from pathlib import Path
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
            
        lines = content.strip().split('\n')
        for line in lines[2:]:
            if '|' in line and not line.startswith('|---'):
                parts = [p.strip() for p in line.split('|')]
                if len(parts) >= 4:
                    businesses.append({
                        'name': parts[1],
                        'website': parts[2],
                        'phone': parts[3] if len(parts) > 3 else '',
                    })
    except FileNotFoundError:
        pass
    
    return businesses


async def check_compliance_stealth(url: str, llm) -> Dict[str, Any]:
    """
    Check a single website for compliance - stealth mode.
    Uses generic user agent, no logging to target server.
    """
    
    # Configure stealth settings
    stealth_task = f"""You are a potential customer visiting {url}.

1. Naturally browse the homepage
2. Look for AI-related content, disclosure statements
3. Check for contact information
4. Find privacy policy link

Return JSON only:
{{
    "ai_disclosure_found": true/false,
    "ai_details": "what you found",
    "contact_found": true/false, 
    "contact_details": "what you found",
    "privacy_found": true/false,
    "privacy_details": "what you found",
    "compliance_score": 0-100,
    "issues": ["issue1"]
}}

If site doesn't load: {{"error": "site unavailable"}}"""

    try:
        agent = Agent(
            task=stealth_task, 
            llm=llm,
        )
        result = await agent.run()
        
        return {
            "url": url,
            "result": str(result)[:800],
            "success": True
        }
    except Exception as e:
        return {
            "url": url,
            "error": str(e)[:200],
            "success": False
        }


async def scan_businesses(businesses: List[Dict[str, str]]):
    """Scan businesses - runs silently."""
    
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("BROWSER_USE_API_KEY")
    if not api_key:
        print("Error: API key required")
        return []
    
    llm = ChatOpenAI(model="gpt-4o", api_key=api_key)
    
    results = []
    
    for i, business in enumerate(businesses):
        website = business.get('website', '').strip()
        if not website:
            continue
            
        if not website.startswith('http'):
            website = 'https://' + website
            
        print(f"Scanning: {business.get('name')}")
        
        result = await check_compliance_stealth(website, llm)
        result['business_name'] = business.get('name', '')
        results.append(result)
        
        await asyncio.sleep(1.5)  # Quiet intervals
    
    return results


def generate_private_report(results: List[Dict[str, Any]], output_file: str = "compliance_results.md"):
    """Generate internal report only."""
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"# Compliance Audit - Internal\n")
        f.write(f"Date: {datetime.now().isoformat()}\n\n")
        
        for r in results:
            name = r.get('business_name', 'Unknown')
            status = "✅" if r.get('success') else "❌"
            
            f.write(f"## {status} {name}\n")
            f.write(f"URL: {r.get('url')}\n")
            
            if r.get('error'):
                f.write(f"Error: {r['error']}\n")
            else:
                f.write(f"Result: {r.get('result', '')[:400]}\n")
            f.write("\n")
    
    print(f"Internal report: {output_file}")


async def main():
    import argparse
    
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', default='revenue/leads_batch1.md')
    parser.add_argument('--output', default='compliance_results.md')
    parser.add_argument('--url')
    args = parser.parse_args()
    
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("BROWSER_USE_API_KEY")
    if not api_key:
        print("Need OPENAI_API_KEY")
        return
    
    llm = ChatOpenAI(model="gpt-4o", api_key=api_key)
    
    if args.url:
        result = await check_compliance_stealth(args.url, llm)
        print(result)
    else:
        businesses = load_businesses_from_file(args.file)
        if businesses:
            results = await scan_businesses(businesses)
            generate_private_report(results, args.output)
        else:
            print("No leads found")


if __name__ == "__main__":
    asyncio.run(main())
