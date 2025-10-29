import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Play } from "lucide-react"

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params
  const profile = await prisma.profile.findUnique({
    where: { username },
    select: { displayName: true }
  })

  if (!profile) return {}

  return {
    title: `Galerie de ${profile.displayName} - Athlink`,
    description: `Découvrez les photos et vidéos de ${profile.displayName}`,
  }
}

export default async function GaleriePage({ params }: Props) {
  const { username } = await params

  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      media: { 
        orderBy: { position: 'asc' }
      }
    }
  })

  if (!profile || !profile.isPublic) {
    notFound()
  }

  const photos = profile.media.filter(m => m.type === "IMAGE")
  const videos = profile.media.filter(m => m.type === "VIDEO")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href={`/${username}`}
              className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour au profil</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Galerie</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
            <p className="text-3xl font-bold text-white">{photos.length}</p>
            <p className="text-sm text-gray-400">Photos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
            <p className="text-3xl font-bold text-white">{videos.length}</p>
            <p className="text-sm text-gray-400">Vidéos</p>
          </div>
        </div>

        {/* Photos Section */}
        {photos.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
              Photos
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div 
                  key={photo.id}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                >
                  <Image
                    src={photo.url}
                    alt={photo.title || "Photo"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {photo.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <Play className="w-5 h-5 text-white" fill="white" />
              </div>
              Vidéos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div 
                  key={video.id}
                  className="group relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                >
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail}
                      alt={video.title || "Video"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <Play className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-black ml-1" fill="black" />
                    </div>
                  </div>
                  {video.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white text-sm font-medium">{video.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {profile.media.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aucun média</h3>
            <p className="text-gray-400">La galerie est vide pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}

