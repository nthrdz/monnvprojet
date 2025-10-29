"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { X, Play, Maximize2 } from "lucide-react"

interface Media {
  id: string
  type: string
  url: string
  title: string | null
  thumbnail: string | null
}

interface MediaGalleryProps {
  media: Media[]
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {media.map((item, index) => (
          <MediaCard
            key={item.id}
            media={item}
            index={index}
            onClick={() => setSelectedMedia(item)}
          />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedMedia && (
          <MediaLightbox
            media={selectedMedia}
            onClose={() => setSelectedMedia(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function MediaCard({ media, index, onClick }: { media: Media; index: number; onClick: () => void }) {
  const isVideo = media.type === 'VIDEO' || media.type === 'YOUTUBE'
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-standard hover:shadow-elevated transition-all"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative w-full h-full">
        <Image
          src={media.type === 'YOUTUBE' ? media.thumbnail! : media.url}
          alt={media.title || 'Media'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Video indicator */}
      {isVideo && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: isHovered ? 1 : 0.6 }}
        >
          <motion.div
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-elevated"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Play className="w-6 h-6 md:w-7 md:h-7 text-gray-900 ml-1" fill="currentColor" />
          </motion.div>
        </motion.div>
      )}

      {/* Expand icon for images */}
      {!isVideo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          className="absolute top-3 right-3"
        >
          <div className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-standard">
            <Maximize2 className="w-4 h-4 text-gray-900" />
          </div>
        </motion.div>
      )}

      {/* Title overlay */}
      {media.title && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 p-3 md:p-4"
        >
          <p className="text-white font-semibold text-xs md:text-sm line-clamp-2 drop-shadow-lg">
            {media.title}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

function MediaLightbox({ media, onClose }: { media: Media; onClose: () => void }) {
  const isVideo = media.type === 'VIDEO' || media.type === 'YOUTUBE'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </motion.button>

      {/* Media content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative max-w-6xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-floating">
            {media.type === 'YOUTUBE' ? (
              <iframe
                src={media.url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={media.url} controls className="w-full h-full" />
            )}
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={media.url}
              alt={media.title || 'Media'}
              width={1920}
              height={1080}
              className="max-h-[90vh] w-auto h-auto object-contain rounded-2xl shadow-floating"
            />
          </div>
        )}

        {/* Title */}
        {media.title && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-center"
          >
            <p className="text-white text-lg font-semibold">{media.title}</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

