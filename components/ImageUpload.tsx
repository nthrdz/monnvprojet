"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type ImageUploadProps = {
  type: "avatar" | "cover"
  currentUrl?: string | null
  onUploadComplete: (url: string) => void
}

export function ImageUpload({ type, currentUrl, onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)

  // Update preview when currentUrl changes (e.g., after cropping)
  useEffect(() => {
    setPreview(currentUrl || null)
  }, [currentUrl])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Le fichier doit être une image")
      return
    }

    // Validate file size (30MB)
    if (file.size > 30 * 1024 * 1024) {
      toast.error("Fichier trop volumineux (max 30MB)")
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        toast.success("Image uploadée !")
        onUploadComplete(data.url)
      } else {
        const data = await res.json()
        toast.error(data.error || "Erreur lors de l'upload")
        setPreview(currentUrl || null)
      }
    } catch (error) {
      toast.error("Erreur lors de l'upload")
      setPreview(currentUrl || null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4 flex flex-col items-center">
      {/* Preview */}
      <div className={`relative ${type === "avatar" ? "w-32 h-32" : "w-full h-48 max-w-md"} rounded-lg overflow-hidden border-2 border-dashed border-gray-300`}>
        {preview ? (
          <img
            src={preview}
            alt={type}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-4xl">{type === "avatar" ? "Avatar" : "Image"}</span>
          </div>
        )}
      </div>

      {/* Upload button */}
      <div className="w-full max-w-md">
        <input
          type="file"
          id={`upload-${type}`}
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <label htmlFor={`upload-${type}`}>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="w-full cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(`upload-${type}`)?.click()
            }}
          >
            {uploading ? "Upload en cours..." : `${preview ? "Changer" : "Uploader"} ${type === "avatar" ? "l'avatar" : "la cover"}`}
          </Button>
        </label>
        <p className="text-xs text-muted-foreground mt-1 text-center">
          {type === "avatar" ? "Image carrée recommandée" : "Image paysage 1200x400px recommandée"} • Max 30MB
        </p>
      </div>
    </div>
  )
}
