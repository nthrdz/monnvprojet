"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ImageUpload"
import SimpleImageCropper from "@/components/ui-pro/simple-image-cropper"
import { toast } from "sonner"
import Link from "next/link"
import { getOriginalSportFromStats } from "@/lib/validations"
import { Crop } from "lucide-react"

interface Profile {
  username: string
  displayName: string
  bio: string
  sport: string
  location: string
  instagram: string
  strava: string
  youtube: string
  tiktok: string
  twitter: string
  telegram: string
  whatsapp: string
  isPublic: boolean
  avatarUrl?: string | null
  coverUrl?: string | null
  stats?: any
}

export function ProfileContent() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [showCropper, setShowCropper] = useState(false)
  const [cropperImage, setCropperImage] = useState<string>("")

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile")
      const data = await res.json()
      setProfile(data.profile)
    } catch (error) {
      toast.error("Erreur lors du chargement du profil")
    } finally {
      setIsFetching(false)
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erreur")
      }

      toast.success("Profil mis à jour !")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCropImage = async (croppedUrl: string) => {
    try {
      // Convert blob URL to File object for upload
      const response = await fetch(croppedUrl)
      const blob = await response.blob()
      
      // Create a File object from the blob
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" })
      
      // Upload via the upload API
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "avatar")
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json()
        throw new Error(errorData.error || "Erreur lors de l'upload")
      }

      const uploadData = await uploadRes.json()
      
      // Update local state with new URL
      setProfile({ ...profile!, avatarUrl: uploadData.url })
      setShowCropper(false)
      
      // Force refresh of the profile to get the updated image
      await fetchProfile()
      
      toast.success("Image rognée et sauvegardée avec succès !")
    } catch (error) {
      console.error("Crop error:", error)
      toast.error("Erreur lors de la sauvegarde de l'image")
    }
  }

  const openCropper = () => {
    if (profile?.avatarUrl) {
      setCropperImage(profile.avatarUrl)
      setShowCropper(true)
    } else {
      toast.error("Aucune image à rogner")
    }
  }

  if (isFetching) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <p>Chargement...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <p>Erreur lors du chargement du profil</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
          <p className="text-muted-foreground">
            Personnalise ton profil public
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/${profile.username}`} target="_blank">
            Voir mon profil
          </Link>
        </Button>
      </div>

      {/* Upload d'images */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Images du profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-3 text-center">Avatar</h3>
            <ImageUpload
              type="avatar"
              currentUrl={profile.avatarUrl}
              onUploadComplete={(url) => {
                setProfile({ ...profile, avatarUrl: url })
                fetchProfile()
              }}
            />
            {profile.avatarUrl && (
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openCropper}
                  className="flex items-center gap-2"
                >
                  <Crop className="w-4 h-4" />
                  Rogner l'image
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="displayName">Nom affiché</Label>
              <Input 
                id="displayName" 
                value={profile.displayName}
                onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                placeholder="Thomas Dupont"
              />
            </div>

            <div>
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">athlink.app/</span>
                <Input 
                  id="username" 
                  value={profile.username}
                  onChange={(e) => setProfile({...profile, username: e.target.value})}
                  placeholder="thomas-runner"
                  className="flex-1"
                  disabled
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Le nom d'utilisateur ne peut pas être modifié pour le moment
              </p>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea 
                id="bio"
                value={profile.bio || ""}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                placeholder="Runner passionné - Marathon en 2h45..."
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {profile.bio?.length || 0} / 500
              </p>
            </div>

            <div>
              <Label htmlFor="sport">Sport principal</Label>
                <Input 
                  id="sport" 
                  value={profile.sport || ""}
                  onChange={(e) => setProfile({...profile, sport: e.target.value})}
                  placeholder="Course à pied, Cyclisme, Natation, Triathlon, Ski..."
                />
            </div>

            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input 
                id="location" 
                value={profile.location || ""}
                onChange={(e) => setProfile({...profile, location: e.target.value})}
                placeholder="Paris, France"
              />
            </div>

            <div className="border-t pt-4 mt-6">
              <h3 className="font-semibold mb-4">Réseaux sociaux</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">@</span>
                    <Input 
                      id="instagram" 
                      value={profile.instagram || ""}
                      onChange={(e) => setProfile({...profile, instagram: e.target.value})}
                      placeholder="username"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="strava">Strava</Label>
                  <Input 
                    id="strava" 
                    value={profile.strava || ""}
                    onChange={(e) => setProfile({...profile, strava: e.target.value})}
                    placeholder="https://www.strava.com/athletes/..."
                  />
                </div>

                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input 
                    id="youtube" 
                    value={profile.youtube || ""}
                    onChange={(e) => setProfile({...profile, youtube: e.target.value})}
                    placeholder="https://youtube.com/@username"
                  />
                </div>

                <div>
                  <Label htmlFor="tiktok">TikTok</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">@</span>
                    <Input 
                      id="tiktok" 
                      value={profile.tiktok || ""}
                      onChange={(e) => setProfile({...profile, tiktok: e.target.value})}
                      placeholder="username"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="twitter">X / Twitter</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">@</span>
                    <Input 
                      id="twitter" 
                      value={profile.twitter || ""}
                      onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                      placeholder="username"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="telegram">Telegram</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">@</span>
                    <Input 
                      id="telegram" 
                      value={profile.telegram || ""}
                      onChange={(e) => setProfile({...profile, telegram: e.target.value})}
                      placeholder="username"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input 
                    id="whatsapp" 
                    value={profile.whatsapp || ""}
                    onChange={(e) => setProfile({...profile, whatsapp: e.target.value})}
                    placeholder="+33612345678"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format international avec indicatif pays
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Profil public</Label>
                  <p className="text-sm text-muted-foreground">
                    Ton profil est {profile.isPublic ? "visible" : "masqué"}
                  </p>
                </div>
                <Button 
                  type="button"
                  variant={profile.isPublic ? "default" : "outline"}
                  onClick={() => setProfile({...profile, isPublic: !profile.isPublic})}
                >
                  {profile.isPublic ? "✓ Public" : "Privé"}
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Image Cropper Modal */}
      {showCropper && (
        <SimpleImageCropper
          imageUrl={cropperImage}
          onCrop={handleCropImage}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  )
}
