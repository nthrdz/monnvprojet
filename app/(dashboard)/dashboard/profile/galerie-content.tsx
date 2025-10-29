"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface Media {
  id: string
  type: "IMAGE" | "VIDEO" | "YOUTUBE"
  url: string
  thumbnail?: string | null
  title?: string | null
  description?: string | null
  position: number
}

export function GalerieContent() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [type, setType] = useState<"IMAGE" | "VIDEO" | "YOUTUBE">("IMAGE")
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(false)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media')
      if (res.ok) {
        const data = await res.json()
        setMedia(data)
      } else {
        console.error('Erreur lors du chargement des médias:', res.status)
        try {
          const errorData = await res.json()
          console.error('Détails de l\'erreur:', errorData)
        } catch (parseError) {
          console.error('Impossible de parser l\'erreur:', parseError)
        }
      }
    } catch (error) {
      console.error('Fetch media error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (selectedFile: File): Promise<string | null> => {
    setUploadProgress(true)
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('type', 'media') // Différent de 'avatar' ou 'cover'

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'upload")
      }

      return data.url
    } catch (error: any) {
      console.error("Upload error:", error)
      alert(`Erreur lors de l'upload: ${error.message}`)
      return null
    } finally {
      setUploadProgress(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let finalUrl = url

      // Si c'est une image/vidéo uploadée
      if ((type === 'IMAGE' || type === 'VIDEO') && file) {
        const uploadedUrl = await handleFileUpload(file)
        if (!uploadedUrl) {
          setIsSubmitting(false)
          return
        }
        finalUrl = uploadedUrl
      } else if ((type === 'IMAGE' || type === 'VIDEO') && !file && !url) {
        alert("Veuillez sélectionner un fichier ou entrer une URL")
        setIsSubmitting(false)
        return
      }

      // Si pas d'URL pour YouTube
      if (type === 'YOUTUBE' && !finalUrl) {
        alert("Veuillez entrer une URL YouTube")
        setIsSubmitting(false)
        return
      }

      const body = {
        type,
        url: finalUrl,
        title: title || undefined,
        description: description || undefined,
      }

      const res = editingId
        ? await fetch(`/api/media/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        : await fetch('/api/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur')
      }

      // Reset form
      setType("IMAGE")
      setUrl("")
      setTitle("")
      setDescription("")
      setFile(null)
      setEditingId(null)
      fetchMedia()
    } catch (error: any) {
      console.error('Submit error:', error)
      alert(`Erreur lors de la sauvegarde: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (m: Media) => {
    setEditingId(m.id)
    setType(m.type)
    setUrl(m.url || "")
    setTitle(m.title || "")
    setDescription(m.description || "")
    setFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce média ?')) return

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      fetchMedia()
    } catch (error: any) {
      console.error('Delete error:', error)
      alert(`Erreur lors de la suppression: ${error.message}`)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setType("IMAGE")
    setUrl("")
    setTitle("")
    setDescription("")
    setFile(null)
  }

  if (loading) return <div className="p-6">Chargement...</div>

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Galerie média 🎬</h1>

      {/* Formulaire d'ajout/édition */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editingId ? 'Modifier le média' : 'Ajouter un média'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Type de média *</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IMAGE">Image</SelectItem>
                  <SelectItem value="VIDEO">Vidéo</SelectItem>
                  <SelectItem value="YOUTUBE">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === "YOUTUBE" ? (
              <div>
                <Label htmlFor="url">URL YouTube *</Label>
                <Input
                  id="url"
                  type="url"
                  value={url || ""}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="file">
                  {type === "IMAGE" ? "Fichier image *" : "Fichier vidéo *"}
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept={type === "IMAGE" ? "image/jpeg,image/jpg,image/png,image/webp" : "video/*"}
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null
                    if (selectedFile) {
                      // Vérifier si c'est un fichier HEIC/HEIF
                      const fileName = selectedFile.name.toLowerCase()
                      const fileType = selectedFile.type.toLowerCase()
                      
                      if (fileName.endsWith('.heic') || fileName.endsWith('.heif') || 
                          fileType === 'image/heic' || fileType === 'image/heif') {
                        alert('Les fichiers HEIC/HEIF ne sont pas supportés. Veuillez convertir votre image en JPEG, PNG ou WebP avant de l\'uploader.')
                        e.target.value = '' // Reset le input
                        setFile(null)
                        return
                      }
                    }
                    setFile(selectedFile)
                  }}
                  required={!editingId}
                />
                {editingId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Laissez vide pour conserver le fichier actuel
                  </p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="title">Titre (optionnel)</Label>
              <Input
                id="title"
                type="text"
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du média"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Input
                id="description"
                type="text"
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du média"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting || uploadProgress}>
                {isSubmitting || uploadProgress
                  ? 'Traitement...'
                  : editingId
                  ? 'Mettre à jour'
                  : 'Ajouter'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Liste des médias */}
      <Card>
        <CardHeader>
          <CardTitle>Vos médias ({media.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {media.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucun média ajouté. Commencez par en ajouter un !
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {media.map((m) => (
                <Card key={m.id} className="overflow-hidden">
                  <div className="relative aspect-square bg-gray-100">
                    {m.type === 'IMAGE' ? (
                      <Image
                        src={m.url}
                        alt={m.title || 'Image'}
                        fill
                        className="object-cover"
                        onLoad={() => {
                          console.log('Image chargée avec succès:', m.url)
                        }}
                        onError={(e) => {
                          console.error('Erreur de chargement de l\'image:', m.url)
                          e.currentTarget.style.display = 'none'
                          // Afficher le fallback
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                    ) : m.type === 'VIDEO' ? (
                      <video
                        src={m.url}
                        className="w-full h-full object-cover cursor-pointer"
                        controls
                        preload="metadata"
                        onError={(e) => {
                          console.error('Erreur de chargement de la vidéo:', m.url)
                          e.currentTarget.style.display = 'none'
                          // Afficher le fallback
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          const video = e.currentTarget
                          if (video.paused) {
                            video.play()
                          } else {
                            video.pause()
                          }
                        }}
                      />
                    ) : (
                      <Image
                        src={m.thumbnail || ''}
                        alt={m.title || 'YouTube'}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          console.error('Erreur de chargement de la miniature YouTube:', m.thumbnail)
                          e.currentTarget.style.display = 'none'
                          // Afficher le fallback
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                    )}
                    
                    {/* Fallback si l'image ne charge pas */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400" style={{display: 'none'}}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {m.type === 'IMAGE' ? 'Image' : m.type === 'VIDEO' ? 'Vidéo' : 'YouTube'}
                        </div>
                        <div className="text-xs font-medium">
                          {m.type === 'IMAGE' ? 'Image' : m.type === 'VIDEO' ? 'Vidéo' : 'YouTube'}
                        </div>
                      </div>
                    </div>
                    
                    {m.type === 'YOUTUBE' && (
                      <div className="absolute top-2 right-2 bg-red-600 text-gray-100 px-2 py-1 rounded text-xs font-bold">
                        YOUTUBE
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    {m.title && (
                      <p className="font-medium text-sm truncate">{m.title}</p>
                    )}
                    {m.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {m.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(m)}
                      >
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(m.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
