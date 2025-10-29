"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCw, ZoomIn, ZoomOut, Move, Crop } from "lucide-react";

interface SimpleImageCropperProps {
  imageUrl: string;
  onCrop: (croppedImageUrl: string) => void;
  onClose: () => void;
}

export default function SimpleImageCropper({ imageUrl, onCrop, onClose }: SimpleImageCropperProps) {
  const [crop, setCrop] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCrop({
      ...crop,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = useCallback(async () => {
    console.log("Starting SIMPLE crop operation...")
    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      const container = containerRef.current;
      
      if (!canvas || !image || !container) {
        console.error("Missing refs")
        setIsProcessing(false);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Could not get canvas context")
        setIsProcessing(false);
        return;
      }

      // Get container dimensions
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      // Calculate image display dimensions
      const imageAspect = image.naturalWidth / image.naturalHeight;
      const containerAspect = containerWidth / containerHeight;
      
      let displayWidth, displayHeight;
      if (imageAspect > containerAspect) {
        displayWidth = containerWidth;
        displayHeight = containerWidth / imageAspect;
      } else {
        displayHeight = containerHeight;
        displayWidth = containerHeight * imageAspect;
      }

      // Calculate offset to center image
      const offsetX = (containerWidth - displayWidth) / 2;
      const offsetY = (containerHeight - displayHeight) / 2;

      // Calculate crop area relative to the displayed image
      const cropX = crop.x - offsetX;
      const cropY = crop.y - offsetY;
      const cropWidth = crop.width;
      const cropHeight = crop.height;

      // Convert to source coordinates
      const sourceX = (cropX / displayWidth) * image.naturalWidth;
      const sourceY = (cropY / displayHeight) * image.naturalHeight;
      const sourceWidth = (cropWidth / displayWidth) * image.naturalWidth;
      const sourceHeight = (cropHeight / displayHeight) * image.naturalHeight;

      console.log("SIMPLE CROP CALCULATION:", {
        container: { width: containerWidth, height: containerHeight },
        display: { width: displayWidth, height: displayHeight },
        offset: { x: offsetX, y: offsetY },
        crop: { x: cropX, y: cropY, width: cropWidth, height: cropHeight },
        source: { x: sourceX, y: sourceY, width: sourceWidth, height: sourceHeight }
      });

      // Set canvas size to crop area
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the cropped portion
      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      console.log("Image drawn to canvas successfully");

      // Convert to dataURL (more reliable than blob)
      const dataURL = canvas.toDataURL("image/jpeg", 0.9);
      console.log("DataURL created:", dataURL.substring(0, 50) + "...");
      
      onCrop(dataURL);
      setIsProcessing(false);
      
    } catch (error) {
      console.error("SIMPLE Crop error:", error)
      setIsProcessing(false);
    }
  }, [crop, onCrop]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Crop className="w-5 h-5 text-gray-700" />
              <h3 className="text-xl font-semibold text-gray-900">Rogner l'image</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Image Container */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="relative bg-gray-50 rounded-xl overflow-hidden mb-6">
              <div 
                ref={containerRef}
                className="relative overflow-hidden" 
                style={{ height: "350px" }}
              >
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Image à rogner"
                  crossOrigin="anonymous"
                  className="absolute top-0 left-0 w-full h-full object-contain"
                  style={{
                    transform: `scale(${scale}) rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                  }}
                />
                
                {/* Crop overlay */}
                <div
                  className="absolute border-2 border-white shadow-lg cursor-move"
                  style={{
                    left: crop.x,
                    top: crop.y,
                    width: crop.width,
                    height: crop.height,
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {/* Corner handles */}
                  {[
                    { x: 0, y: 0, cursor: "nw-resize" },
                    { x: crop.width, y: 0, cursor: "ne-resize" },
                    { x: 0, y: crop.height, cursor: "sw-resize" },
                    { x: crop.width, y: crop.height, cursor: "se-resize" },
                  ].map((handle, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-white border-2 border-gray-700 rounded-full"
                      style={{
                        left: handle.x - 6,
                        top: handle.y - 6,
                        cursor: handle.cursor,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Scale */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoom ({Math.round(scale * 100)}%)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <button
                    onClick={() => setScale(Math.min(3, scale + 0.1))}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rotation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotation ({rotation}°)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRotation(rotation - 90)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="15"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <button
                    onClick={() => setRotation(rotation + 90)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <RotateCw className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCrop}
              disabled={isProcessing}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Traitement..." : "Valider et sauvegarder"}
            </button>
          </div>

          {/* Hidden canvas for cropping */}
          <canvas ref={canvasRef} className="hidden" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
