#!/bin/bash

# Mobile Testing Script for Transparent Treats Scanner
# This script makes it easy to test the application on mobile devices

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PORT=${PORT:-5173}
FRONTEND_DIR="./transparent-treats-main"
PYTHON_SERVER_PORT=8888

# Function to print colored output
print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Get local IP - try common patterns for dev environment
get_local_ip() {
    # First try to get the primary non-loopback, non-docker IP
    LOCAL_IP=$(hostname -I | awk '{
        for(i=1; i<=NF; i++) {
            if ($i !~ /^172\.(17|18|19|20|30|31)\./ && $i !~ /^127\./) {
                print $i; exit
            }
        }
    }')
    
    if [ -z "$LOCAL_IP" ]; then
        # Fallback to docker-safe IP if available
        LOCAL_IP=$(hostname -I | awk '{print $1}')
    fi
    
    echo "$LOCAL_IP"
}

# Generate QR code URL
generate_qr_code() {
    local url=$1
    local qr_url="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=$(echo -n "$url" | jq -sRr @uri)"
    echo "$qr_url"
}

# Check if backend is running
check_backend() {
    if timeout 2 bash -c "echo >/dev/tcp/localhost/3000" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Start frontend preview
start_frontend() {
    print_header "Starting Frontend Preview Server"
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        print_error "Frontend directory not found: $FRONTEND_DIR"
        exit 1
    fi
    
    cd "$FRONTEND_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_info "Installing dependencies..."
        npm install --legacy-peer-deps 2>&1 | tail -5
    fi
    
    print_info "Building application..."
    npm run build 2>&1 | grep -E "built in|error" || true
    
    print_info "Starting preview server on port $PORT..."
    npx vite preview --port "$PORT" &
    VITE_PID=$!
    
    # Wait for server to start
    sleep 3
    
    if kill -0 $VITE_PID 2>/dev/null; then
        print_success "Frontend preview started (PID: $VITE_PID)"
        return 0
    else
        print_error "Failed to start frontend preview"
        exit 1
    fi
}

# Generate QR code image with Python
generate_qr_image() {
    local url=$1
    local output_file="/tmp/mobile-test-qr.html"
    
    # Use a public QR code service to display QR code
    cat > "$output_file" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Mobile Testing QR Code</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 500px;
        }
        h1 {
            color: #333;
            margin-top: 0;
            font-size: 28px;
        }
        .qr-box {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 2px dashed #ccc;
        }
        img {
            width: 300px;
            height: 300px;
        }
        .url {
            font-family: 'Monaco', 'Courier New', monospace;
            background: #f0f0f0;
            padding: 12px;
            border-radius: 6px;
            word-break: break-all;
            font-size: 12px;
            color: #666;
            margin: 20px 0;
        }
        .instructions {
            text-align: left;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .instructions h2 {
            color: #333;
            font-size: 16px;
            margin-bottom: 10px;
        }
        .instructions li {
            margin: 8px 0;
            color: #666;
            font-size: 14px;
        }
        .badge {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 Transparent Treats</h1>
        <p style="color: #666; margin: 5px 0;">Mobile Scanner Testing</p>
        
        <div class="qr-box">
            <p style="margin: 0 0 15px 0; color: #999; font-size: 12px;">Scan with your mobile device</p>
            <img src="" id="qr-image" alt="QR Code">
        </div>
        
        <div class="url">
            <strong>Direct URL:</strong><br>
            <span id="url-text"></span>
        </div>
        
        <div class="instructions">
            <h2>🚀 Testing Steps</h2>
            <ol>
                <li><strong>Camera scan:</strong> Open the /scan page and use your device camera to scan barcodes</li>
                <li><strong>Image upload:</strong> Use the file picker to upload images with barcodes/QR codes</li>
                <li><strong>Manual input:</strong> Type product codes directly in the manual input field</li>
                <li><strong>Product lookup:</strong> Confirm the product appears from the backend database or local data</li>
                <li><strong>Submit:</strong> Test the prefilled submit form when creating new products</li>
            </ol>
        </div>
        
        <div style="margin-top: 30px; color: #999; font-size: 12px;">
            <p>Press CTRL+C in the terminal to stop the preview server</p>
        </div>
    </div>

    <script>
        // Get URL from query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const testUrl = urlParams.get('url');
        
        if (testUrl) {
            document.getElementById('url-text').textContent = testUrl;
            const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(testUrl);
            document.getElementById('qr-image').src = qrUrl;
        }
    </script>
</body>
</html>
EOF
    
    # Start simple Python HTTP server for the QR code page
    cd /tmp
    print_info "Starting QR code server on port $PYTHON_SERVER_PORT..."
    python3 -m http.server $PYTHON_SERVER_PORT > /dev/null 2>&1 &
    PYTHON_PID=$!
    sleep 1
    
    echo "http://localhost:$PYTHON_SERVER_PORT/mobile-test-qr.html?url=$(echo -n "$url" | jq -sRr @uri)"
}

# Main execution
main() {
    print_header "Transparent Treats - Mobile Testing Setup"
    
    # Get local IP
    LOCAL_IP=$(get_local_ip)
    
    if [ -z "$LOCAL_IP" ]; then
        print_error "Could not determine local IP address"
        exit 1
    fi
    
    print_success "Local IP: $LOCAL_IP"
    
    # Check backend
    if check_backend; then
        print_success "Backend is running on localhost:3000"
    else
        print_info "Backend is not running (optional for testing with local data)"
    fi
    
    # Start frontend
    start_frontend
    cd - > /dev/null
    
    # Build the test URL
    TEST_URL="http://$LOCAL_IP:$PORT/scan"
    
    print_header "Mobile Testing Information"
    print_success "Frontend is running at: http://$LOCAL_IP:$PORT"
    print_success "Scanner page: $TEST_URL"
    
    # Generate QR code
    print_info "Generating QR code..."
    QR_PAGE=$(generate_qr_image "$TEST_URL")
    
    echo ""
    print_header "Testing Options"
    
    echo -e "${GREEN}Option 1: Scan QR Code${NC}"
    echo "  Open this page on any device: file:///tmp/mobile-test-qr.html"
    echo "  Or access via browser:"
    echo "  ${BLUE}http://localhost:$PYTHON_SERVER_PORT/mobile-test-qr.html?url=$(echo -n "$TEST_URL" | jq -sRr @uri)${NC}"
    
    echo ""
    echo -e "${GREEN}Option 2: Direct URL${NC}"
    echo "  Visit directly on mobile: ${BLUE}$TEST_URL${NC}"
    
    echo ""
    echo -e "${GREEN}Option 3: Local Testing${NC}"
    echo "  Visit on this machine: ${BLUE}http://localhost:$PORT/scan${NC}"
    
    echo ""
    print_header "Network Access"
    echo -e "${YELLOW}On your mobile device (same network):${NC}"
    echo "  1. Connect to same WiFi as this machine"
    echo "  2. Visit: ${BLUE}http://$LOCAL_IP:$PORT${NC}"
    echo "  3. Go to Scanner page and test:"
    echo "     • Camera scanning (requires HTTPS or localhost)"
    echo "     • Image upload with barcodes"
    echo "     • Manual code input"
    
    echo ""
    print_header "Tips & Troubleshooting"
    echo -e "${YELLOW}Camera access:${NC}"
    echo "  • Works on HTTPS (production) and localhost/127.0.0.1"
    echo "  • May show security warning on HTTP from IP address"
    echo "  • Use image upload as fallback on mobile over HTTP"
    
    echo -e "\n${YELLOW}Backend connectivity:${NC}"
    if check_backend; then
        echo "  • Backend API: http://$LOCAL_IP:3000/api"
        echo "  • Barcode lookup: http://$LOCAL_IP:3000/api/products/barcode/:code"
    else
        echo "  • Backend not running - using local fallback data"
        echo "  • To enable backend: start backend server on port 3000"
    fi
    
    echo ""
    print_header "Keyboard Shortcuts"
    echo "  ${YELLOW}Ctrl+C${NC}   - Stop the preview server"
    echo "  ${YELLOW}Ctrl+Shift+K${NC} - Clear terminal"
    
    echo ""
    echo -e "${GREEN}Ready for testing! Open the scanner page on your mobile device.${NC}"
    echo ""
    
    # Keep the script running
    wait
}

# Trap to clean up on exit
cleanup() {
    print_info "Shutting down preview server..."
    if [ ! -z "$VITE_PID" ]; then
        kill $VITE_PID 2>/dev/null || true
    fi
    if [ ! -z "$PYTHON_PID" ]; then
        kill $PYTHON_PID 2>/dev/null || true
    fi
    print_success "Cleanup complete"
}

trap cleanup EXIT

# Run main
main
