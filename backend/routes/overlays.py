from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
from datetime import datetime
from pymongo.errors import PyMongoError
import logging

bp = Blueprint("overlays", __name__, url_prefix="/api/overlays")

@bp.route("/", methods=["GET"])
def get_overlays():
    """Get all overlays for a stream."""
    try:
        stream_id = request.args.get("stream_id", "default")
        
        # Get overlays from MongoDB
        overlays_collection = current_app.mongo.db.overlays
        overlays = list(overlays_collection.find({"stream_id": stream_id}))
        
        # Convert ObjectId to string for JSON serialization
        for overlay in overlays:
            overlay["_id"] = str(overlay["_id"])
        
        return jsonify({
            "success": True,
            "overlays": overlays,
            "count": len(overlays)
        }), 200
        
    except PyMongoError as e:
        current_app.logger.error(f"MongoDB error: {str(e)}")
        return jsonify({
            "error": "Database error",
            "message": "Failed to retrieve overlays"
        }), 500
    except Exception as e:
        current_app.logger.error(f"Error getting overlays: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@bp.route("/<overlay_id>", methods=["GET"])
def get_overlay(overlay_id):
    """Get a specific overlay by ID."""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(overlay_id):
            return jsonify({"error": "Invalid overlay ID"}), 400
        
        overlays_collection = current_app.mongo.db.overlays
        overlay = overlays_collection.find_one({"_id": ObjectId(overlay_id)})
        
        if not overlay:
            return jsonify({"error": "Overlay not found"}), 404
        
        # Convert ObjectId to string
        overlay["_id"] = str(overlay["_id"])
        
        return jsonify({
            "success": True,
            "overlay": overlay
        }), 200
        
    except PyMongoError as e:
        current_app.logger.error(f"MongoDB error: {str(e)}")
        return jsonify({
            "error": "Database error",
            "message": "Failed to retrieve overlay"
        }), 500
    except Exception as e:
        current_app.logger.error(f"Error getting overlay: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@bp.route("/", methods=["POST"])
def create_overlay():
    """Create a new overlay."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        # Validate required fields
        required_fields = ["type", "content", "position", "size"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Prepare overlay data
        overlay_data = {
            "stream_id": data.get("stream_id", "default"),
            "type": data["type"],
            "content": data["content"],
            "position": data["position"],
            "size": data["size"],
            "zIndex": data.get("zIndex", 1),
            "visible": data.get("visible", True),
            "style": data.get("style", {}),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        # Insert into MongoDB
        overlays_collection = current_app.mongo.db.overlays
        result = overlays_collection.insert_one(overlay_data)
        
        # Get the created overlay
        created_overlay = overlays_collection.find_one({"_id": result.inserted_id})
        created_overlay["_id"] = str(created_overlay["_id"])
        
        return jsonify({
            "success": True,
            "message": "Overlay created successfully",
            "overlay": created_overlay
        }), 201
        
    except PyMongoError as e:
        current_app.logger.error(f"MongoDB error: {str(e)}")
        return jsonify({
            "error": "Database error",
            "message": "Failed to create overlay"
        }), 500
    except Exception as e:
        current_app.logger.error(f"Error creating overlay: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@bp.route("/<overlay_id>", methods=["PUT"])
def update_overlay(overlay_id):
    """Update an existing overlay."""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(overlay_id):
            return jsonify({"error": "Invalid overlay ID"}), 400
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        # Prepare update data
        update_data = {
            "updatedAt": datetime.utcnow()
        }
        
        # Add fields that are present in the request
        fields_to_update = ["type", "content", "position", "size", "zIndex", "visible", "style"]
        for field in fields_to_update:
            if field in data:
                update_data[field] = data[field]
        
        # Update in MongoDB
        overlays_collection = current_app.mongo.db.overlays
        result = overlays_collection.update_one(
            {"_id": ObjectId(overlay_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Overlay not found"}), 404
        
        # Get the updated overlay
        updated_overlay = overlays_collection.find_one({"_id": ObjectId(overlay_id)})
        updated_overlay["_id"] = str(updated_overlay["_id"])
        
        return jsonify({
            "success": True,
            "message": "Overlay updated successfully",
            "overlay": updated_overlay
        }), 200
        
    except PyMongoError as e:
        current_app.logger.error(f"MongoDB error: {str(e)}")
        return jsonify({
            "error": "Database error",
            "message": "Failed to update overlay"
        }), 500
    except Exception as e:
        current_app.logger.error(f"Error updating overlay: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@bp.route("/<overlay_id>", methods=["DELETE"])
def delete_overlay(overlay_id):
    """Delete an overlay."""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(overlay_id):
            return jsonify({"error": "Invalid overlay ID"}), 400
        
        # Delete from MongoDB
        overlays_collection = current_app.mongo.db.overlays
        result = overlays_collection.delete_one({"_id": ObjectId(overlay_id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Overlay not found"}), 404
        
        return jsonify({
            "success": True,
            "message": "Overlay deleted successfully"
        }), 200
        
    except PyMongoError as e:
        current_app.logger.error(f"MongoDB error: {str(e)}")
        return jsonify({
            "error": "Database error",
            "message": "Failed to delete overlay"
        }), 500
    except Exception as e:
        current_app.logger.error(f"Error deleting overlay: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@bp.route("/stream/<stream_id>", methods=["DELETE"])
def delete_stream_overlays(stream_id):
    """Delete all overlays for a specific stream."""
    try:
        # Delete all overlays for the stream from MongoDB
        overlays_collection = current_app.mongo.db.overlays
        result = overlays_collection.delete_many({"stream_id": stream_id})
        
        return jsonify({
            "success": True,
            "message": f"Deleted {result.deleted_count} overlays for stream {stream_id}"
        }), 200
        
    except PyMongoError as e:
        current_app.logger.error(f"MongoDB error: {str(e)}")
        return jsonify({
            "error": "Database error",
            "message": "Failed to delete stream overlays"
        }), 500
    except Exception as e:
        current_app.logger.error(f"Error deleting stream overlays: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
