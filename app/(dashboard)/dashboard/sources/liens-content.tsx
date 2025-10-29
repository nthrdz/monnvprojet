"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { linkSchema, type LinkInput } from "@/lib/validations"
import { toast } from "sonner"
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Link2, 
  ExternalLink, 
  GripVertical,
  Eye,
  EyeOff,
  BarChart3,
  Copy,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Link extends LinkInput {
  id: string
  position: number
  clicks: number
  isActive: boolean
}

export function LiensContent() {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const form = useForm<LinkInput>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      icon: "🔗",
    }
  })

  useEffect(() => {
    fetchLinks()
  }, [])

  async function fetchLinks() {
    try {
      const res = await fetch("/api/links")
      const data = await res.json()
      setLinks(data.links || [])
    } catch (error) {
      toast.error("Erreur lors du chargement des liens")
    }
  }

  async function onSubmit(values: LinkInput) {
    setIsLoading(true)
    try {
      const url = editingId ? `/api/links/${editingId}` : "/api/links"
      const method = editingId ? "PATCH" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erreur")
      }

      toast.success(editingId ? "Lien modifié !" : "Lien créé !")
      form.reset()
      setEditingId(null)
      setShowForm(false)
      fetchLinks()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteLink(id: string) {
    if (!confirm("Supprimer ce lien ?")) return

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      toast.success("Lien supprimé !")
      fetchLinks()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  function editLink(link: Link) {
    setEditingId(link.id)
    setShowForm(true)
    form.setValue("title", link.title)
    form.setValue("url", link.url)
    form.setValue("description", link.description || "")
    form.setValue("icon", link.icon || "")
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success("Lien copié !")
  }

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const activeLinks = links.filter(link => link.isActive).length

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
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Liens</p>
              <p className="text-2xl font-bold text-gray-900">{links.length}</p>
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
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Liens Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{activeLinks}</p>
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
          <h2 className="text-xl font-semibold text-gray-900">Mes Liens</h2>
          <p className="text-gray-600">Gérez vos liens personnalisés</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            form.reset()
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Annuler" : "Nouveau Lien"}
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
                {editingId ? "Modifier le lien" : "Créer un nouveau lien"}
              </h3>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      {...form.register("title")}
                      placeholder="Mon lien"
                      className="mt-1"
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="url">URL *</Label>
                    <Input
                      id="url"
                      type="url"
                      {...form.register("url")}
                      placeholder="https://example.com"
                      className="mt-1"
                    />
                    {form.formState.errors.url && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.url.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      {...form.register("description")}
                      placeholder="Description optionnelle"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="icon">Icône</Label>
                    <Input
                      id="icon"
                      {...form.register("icon")}
                      placeholder="🔗"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        {editingId ? "Modifier" : "Créer"}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links List */}
      <div className="space-y-3">
        <AnimatePresence>
          {links.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="text-3xl cursor-pointer"
                    >
                      {link.icon}
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{link.title}</h3>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          link.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        )}>
                          {link.isActive ? "Actif" : "Inactif"}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate max-w-md">{link.url}</p>
                      {link.description && (
                        <p className="text-sm text-gray-500 mt-1">{link.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <BarChart3 className="w-4 h-4" />
                          {link.clicks} clics
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(link.url, link.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copier le lien"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => window.open(link.url, '_blank')}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Ouvrir le lien"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => editLink(link)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteLink(link.id)}
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
        
        {links.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun lien créé</h3>
            <p className="text-gray-600 mb-4">Commencez par créer votre premier lien personnalisé</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Créer mon premier lien
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}