from flask import Blueprint, request, jsonify, current_app
import requests
from config import settings

bp = Blueprint("rtspme", __name__, url_prefix="/api/rtspme")


@bp.route("/convert-rtsp", methods=["POST"])
def convert_rtsp_to_embed():
    """Convert RTSP URL to standard RTSP.me embed URL."""
    try:
        # Check if credentials are configured
        if not settings.rtspme_email or not settings.rtspme_password:
            return jsonify({
                "error": "RTSP.me integration not configured",
                "message": "Set RTSPME_EMAIL and RTSPME_PASSWORD environment variables"
            }), 501
        
        # Get request data
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        rtsp_url = data.get("rtsp_url")
        stream_name = data.get("name", "RTSP Stream")
        client_ip = data.get("ip")  # Optional client IP for access control
        
        if not rtsp_url:
            return jsonify({"error": "RTSP URL is required"}), 400
        
        # Validate RTSP URL format
        if not rtsp_url.startswith(("rtsp://", "rtsps://")):
            return jsonify({"error": "Invalid RTSP URL format. Must start with rtsp:// or rtsps://"}), 400
        
        # Prepare request to rtsp.me API
        api_url = "https://rtsp.me/api/"
        payload = {
            "email": settings.rtspme_email,
            "password": settings.rtspme_password,
            "url": rtsp_url,
            "name": stream_name
        }
        
        if client_ip:
            payload["ip"] = client_ip
        
        try:
            response = requests.post(api_url, data=payload, timeout=30)
            response.raise_for_status()
            
            rtspme_data = response.json()
            
            # Check if we got camera data
            if "cameras" in rtspme_data and len(rtspme_data["cameras"]) > 0:
                camera = rtspme_data["cameras"][0]
                stream_id = camera.get("id")
                access_url = camera.get("url", "")
                
                if not stream_id:
                    return jsonify({
                        "error": "Failed to get stream ID from RTSP.me",
                        "message": "Please try again or check your RTSP URL"
                    }), 500
                
                # Use the standard RTSP.me embed URL format
                embed_url = f"https://rtsp.me/embed/{stream_id}/"
                
                return jsonify({
                    "success": True,
                    "rtsp_url": rtsp_url,
                    "stream_id": stream_id,
                    "name": camera.get("name", stream_name),
                    "embed_url": embed_url,
                    "access_url": access_url,
                    "stream_url": camera.get("url", ""),
                    "poster_url": camera.get("poster", ""),
                    "monthly_counter": camera.get("monthly_counter", ""),
                    "iframe_code": f'<iframe width="640" height="480" src="{embed_url}" frameborder="0" title="RTSP Stream Player" allowfullscreen></iframe>',
                    "note": f"Standard RTSP.me embed URL generated. Each RTSP URL will play its specific video content."
                }), 200
            else:
                return jsonify({
                    "error": "Failed to convert RTSP URL to embed",
                    "message": "Please check your RTSP URL and try again"
                }), 404
                
        except requests.RequestException as e:
            current_app.logger.error(f"RTSP.me API error: {str(e)}")
            return jsonify({
                "error": "Failed to connect to RTSP.me",
                "message": "Please check your credentials and RTSP URL"
            }), 502
        
    except Exception as e:
        current_app.logger.error(f"Error converting RTSP to embed: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
