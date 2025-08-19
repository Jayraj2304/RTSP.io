from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from config import settings
import logging

def create_app():
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])
    
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    app.logger.setLevel(logging.INFO)
    
    # Configure MongoDB
    try:
        client = MongoClient(settings.mongodb_url)
        app.mongo = client
        app.logger.info("MongoDB connected successfully")
    except Exception as e:
        app.logger.error(f"Failed to connect to MongoDB: {e}")
        app.mongo = None
    
    # Register blueprints
    from routes.rtspme import bp as rtspme_bp
    from routes.overlays import bp as overlays_bp
    
    app.register_blueprint(rtspme_bp)
    app.register_blueprint(overlays_bp)
    
    @app.route("/")
    def health_check():
        return {"status": "healthy", "message": "RTSP.io API is running"}
    
    @app.route("/api/health")
    def api_health():
        return {
            "status": "healthy",
            "mongodb": "connected" if app.mongo else "disconnected",
            "version": "1.0.0"
        }
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
