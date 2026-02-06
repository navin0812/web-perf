#!/bin/bash

# Test script for web-perf on various sample websites
# This validates all audit modules and output formats

set -e

echo "🧪 Web-Perf Testing Suite"
echo "========================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
PASSED=0
FAILED=0

# Test function
run_test() {
    local name=$1
    local url=$2
    local args=$3
    
    echo -e "${YELLOW}Testing: $name${NC}"
    echo "URL: $url"
    echo "Args: $args"
    echo ""
    
    output=$(node packages/cli/bin/cli.js --url "$url" $args 2>&1)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "Error output:"
        echo "$output"
        ((FAILED++))
    fi
    echo ""
    echo "---"
    echo ""
}

# Create test output directory
mkdir -p test-results

# Test 1: Simple well-formed website
run_test "Simple Website (bot)" \
    "https://amazon.com" \
    "--format all --output-dir test-results/example"

# Test 2: Complex website (GitHub)
run_test "Complex Website (github.com)" \
    "https://github.com" \
    "--format all --output-dir test-results/github"

# Test 3: E-commerce site (Amazon)
run_test "E-commerce (amazon.com)" \
    "https://amazon.com" \
    "--format all --output-dir test-results/amazon"

# Test 4: JSON format only
run_test "JSON Format Only" \
    "https://amazon.com" \
    "--format json --output-dir test-results/json-only"

# Test 5: HTML format only
run_test "HTML Format Only" \
    "https://amazon.com" \
    "--format html --output-dir test-results/html-only"

# Test 6: Terminal format only
run_test "Terminal Format Only" \
    "https://amazon.com" \
    "--format terminal"

# Test 7: With thresholds (should pass)
run_test "Thresholds (Lenient)" \
    "https://amazon.com" \
    "--format json --output-dir test-results/threshold-pass --threshold '{"critical":100, "serious":100, "minor":100}'"

# Test 8: Skip audits
run_test "Skip PWA Audit" \
    "https://amazon.com" \
    "--format json --output-dir test-results/skip-pwa --skip-audits pwa"

# Test 9: Skip multiple audits
run_test "Skip Multiple Audits" \
    "https://amazon.com" \
    "--format json --output-dir test-results/skip-multiple --skip-audits pwa,best-practices"

# Test 10: Wikipedia (knowledge site)
run_test "Knowledge Site (wikipedia.org)" \
    "https://wikipedia.org" \
    "--format json --output-dir test-results/wikipedia"

# Summary
echo "================================"
echo "📊 Test Results Summary"
echo "================================"
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
