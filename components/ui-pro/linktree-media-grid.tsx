"use client"

import { useState } from "react"
import Image from "next/image"

interface Media {
  id: string
  type: string
  url: string
  thumbnail?: string | null
  title?: string | null
}

interface LinktreeMediaGridProps {
  media: Media[]
}

export function LinktreeMediaGrid({ media }: LinktreeMediaGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  if (!media || media.length === 0) return null

  const openLightbox = (item: Media) => {
    setSelectedMedia(item)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setSelectedMedia(null)
  }
  
  return (
    <>
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3 text-center">Galerie</p>
        <div className="grid grid-cols-3 gap-2">
          {media.slice(0, 6).map((item) => (
            <div 
              key={item.id} 
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => openLightbox(item)}
            >
              {item.type === 'VIDEO' ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={item.type === 'YOUTUBE' && item.thumbnail ? item.thumbnail : item.url}
                  alt={item.title || 'Media'}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="33vw"
                />
              )}
              {(item.type === 'VIDEO' || item.type === 'YOUTUBE') && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && selectedMedia && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-yellow-500 transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.type === 'VIDEO' ? (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="w-full rounded-lg"
                controlsList="nodownload"
              />
            ) : selectedMedia.type === 'YOUTUBE' ? (
              <iframe
                src={selectedMedia.url.replace('watch?v=', 'embed/')}
                className="w-full aspect-video rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <Image
                src={selectedMedia.url}
                alt={selectedMedia.title || 'Media'}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg"
              />
            )}
            {selectedMedia.title && (
              <p className="text-white text-center mt-4 text-lg font-semibold">{selectedMedia.title}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

