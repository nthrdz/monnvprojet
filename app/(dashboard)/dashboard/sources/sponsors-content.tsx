"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Image from "next/image"
import { searchBrand, getBrandLogoUrl, type Brand } from "@/lib/brands"
import { 
  Award, 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  BarChart3,
  Copy,
  Check,
  Upload,
  Search,
  Building2,
  Tag,
  Globe
} from "lucide-react"
import { cn } from "@/lib/utils"

type Sponsor = {
  id: string
  name: string
  logoUrl?: string | null
  websiteUrl?: string | null
  promoCode?: string | null
  description?: string | null
  position: number
  clicks: number
}

export function SponsorsContent() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: "",
    promoCode: "",
    description: ""
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [brandSuggestions, setBrandSuggestions] = useState<Brand[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [isExtractingLogo, setIsExtractingLogo] = useState(false)

  useEffect(() => {
    fetchSponsors()
  }, [])

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function fetchSponsors() {
    try {
      const res = await fetch("/api/sponsors")
      if (res.ok) {
        const data = await res.json()
        setSponsors(data.sponsors || [])
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des sponsors")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    try {
      let logoUrl = formData.logoUrl

      // Upload du logo si un fichier est sélectionné
      if (logoFile) {
        setIsUploading(true)
        const formDataUpload = new FormData()
        formDataUpload.append("file", logoFile)
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload
        })
        
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          logoUrl = uploadData.url
        }
        setIsUploading(false)
      }

      const url = editingId ? `/api/sponsors/${editingId}` : "/api/sponsors"
      const method = editingId ? "PATCH" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          logoUrl
        })
      })

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde")

      toast.success(editingId ? "Sponsor modifié !" : "Sponsor ajouté !")
      setFormData({
        name: "",
        logoUrl: "",
        websiteUrl: "",
        promoCode: "",
        description: ""
      })
      setLogoFile(null)
      setLogoPreview(null)
      setEditingId(null)
      setShowForm(false)
      fetchSponsors()
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde")
    } finally {
      setIsUploading(false)
    }
  }

  async function deleteSponsor(id: string) {
    if (!confirm("Supprimer ce sponsor ?")) return
    
    try {
      const res = await fetch(`/api/sponsors/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erreur lors de la suppression")
      
      toast.success("Sponsor supprimé !")
      fetchSponsors()
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  function editSponsor(sponsor: Sponsor) {
    setEditingId(sponsor.id)
    setShowForm(true)
    setFormData({
      name: sponsor.name,
      logoUrl: sponsor.logoUrl || "",
      websiteUrl: sponsor.websiteUrl || "",
      promoCode: sponsor.promoCode || "",
      description: sponsor.description || ""
    })
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success("Code copié !")
  }

  async function handleNameChange(value: string) {
    setFormData({ ...formData, name: value })
    
    if (value.length > 2) {
      const suggestions = searchBrand(value)
      setBrandSuggestions(suggestions)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  async function selectBrand(brand: Brand) {
    setFormData({ 
      ...formData, 
      name: brand.name,
      logoUrl: getBrandLogoUrl(brand)
    })
    setShowSuggestions(false)
  }

  async function extractLogo() {
    if (!formData.websiteUrl) {
      toast.error("Veuillez d'abord saisir l'URL du site web")
      return
    }

    setIsExtractingLogo(true)
    try {
      const res = await fetch("/api/sponsors/extract-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.websiteUrl })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.logoUrl) {
          setFormData({ ...formData, logoUrl: data.logoUrl })
          toast.success("Logo extrait avec succès !")
        } else {
          toast.error("Aucun logo trouvé sur ce site")
        }
      } else {
        toast.error("Erreur lors de l'extraction du logo")
      }
    } catch (error) {
      toast.error("Erreur lors de l'extraction du logo")
    } finally {
      setIsExtractingLogo(false)
    }
  }

  const totalClicks = sponsors.reduce((sum, sponsor) => sum + sponsor.clicks, 0)
  const sponsorsWithPromo = sponsors.filter(sponsor => sponsor.promoCode).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full"
        />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Sponsors</p>
              <p className="text-2xl font-bold text-gray-900">{sponsors.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-lg">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Avec Code Promo</p>
              <p className="text-2xl font-bold text-gray-900">{sponsorsWithPromo}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Clics</p>
              <p className="text-2xl font-bold text-gray-900">{totalClicks}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Mes Sponsors</h2>
          <p className="text-gray-600">Gérez vos partenaires et collaborations</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({
              name: "",
              logoUrl: "",
              websiteUrl: "",
              promoCode: "",
              description: ""
            })
            setLogoFile(null)
            setLogoPreview(null)
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Annuler" : "Nouveau Sponsor"}
        </motion.button>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? "Modifier le sponsor" : "Ajouter un nouveau sponsor"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Label htmlFor="name">Nom du sponsor *</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Nike"
                        className="mt-1 pr-10"
                        required
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    
                    {/* Suggestions de marques */}
                    {showSuggestions && brandSuggestions.length > 0 && (
                      <div ref={suggestionsRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {brandSuggestions.map((brand) => (
                          <button
                            key={brand.name}
                            type="button"
                            onClick={() => selectBrand(brand)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <img 
                              src={getBrandLogoUrl(brand)} 
                              alt={brand.name}
                              className="w-6 h-6 object-contain"
                            />
                            {brand.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="websiteUrl">Site web</Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      placeholder="https://nike.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="promoCode">Code promo</Label>
                    <Input
                      id="promoCode"
                      value={formData.promoCode}
                      onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                      placeholder="ATHLINK20"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Équipement sportif"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Logo Section */}
                <div>
                  <Label>Logo</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        type="url"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="flex-1"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={extractLogo}
                        disabled={isExtractingLogo || !formData.websiteUrl}
                        className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        {isExtractingLogo ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                        Extraire
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setLogoFile(file)
                            setLogoPreview(URL.createObjectURL(file))
                          }
                        }}
                        className="flex-1"
                      />
                      <Upload className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    {(formData.logoUrl || logoPreview) && (
                      <div className="flex items-center gap-2">
                        <img 
                          src={logoPreview || formData.logoUrl || ""} 
                          alt="Logo preview"
                          className="w-12 h-12 object-contain border border-gray-200 rounded"
                        />
                        <span className="text-sm text-gray-600">Aperçu du logo</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    type="submit"
                    disabled={isUploading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Upload...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        {editingId ? "Modifier" : "Ajouter"}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sponsors List */}
      <div className="space-y-3">
        <AnimatePresence>
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {sponsor.logoUrl ? (
                        <img 
                          src={sponsor.logoUrl} 
                          alt={sponsor.name}
                          className="w-12 h-12 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-green-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{sponsor.name}</h3>
                        {sponsor.promoCode && (
                          <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            Code promo
                          </div>
                        )}
                      </div>
                      {sponsor.description && (
                        <p className="text-sm text-gray-600">{sponsor.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <BarChart3 className="w-4 h-4" />
                          {sponsor.clicks} clics
                        </div>
                        {sponsor.websiteUrl && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Globe className="w-4 h-4" />
                            Site web
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {sponsor.promoCode && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(sponsor.promoCode!, sponsor.id)}
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Copier le code promo"
                      >
                        {copiedId === sponsor.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </motion.button>
                    )}
                    
                    {sponsor.websiteUrl && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.open(sponsor.websiteUrl, '_blank')}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Visiter le site"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => editSponsor(sponsor)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteSponsor(sponsor.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {sponsors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun sponsor ajouté</h3>
            <p className="text-gray-600 mb-4">Commencez par ajouter votre premier partenaire</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Ajouter mon premier sponsor
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}