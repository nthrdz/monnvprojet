"use client"

import { useState, useEffect } from "react"
import { Target, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AffiliateBadgeProps {
  username: string
  className?: string
}

export function AffiliateBadge({ username, className = "" }: AffiliateBadgeProps) {
  const [isAffiliate, setIsAffiliate] = useState(false)
  const [affiliateCode, setAffiliateCode] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkAffiliateStatus()
  }, [username])

  const checkAffiliateStatus = async () => {
    try {
      const response = await fetch(`/api/affiliate/status?username=${username}`)
      if (response.ok) {
        const data = await response.json()
        if (data.isAffiliate && data.status === 'APPROVED') {
          setIsAffiliate(true)
          setAffiliateCode(data.affiliateCode)
        }
      }
    } catch (error) {
      console.error('Erreur vérification statut affilié:', error)
    }
  }

  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}?ref=${affiliateCode}`
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isAffiliate) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
        <Target className="w-3 h-3 mr-1" />
        Ambassadeur
      </Badge>
      
      <Button
        onClick={copyReferralLink}
        size="sm"
        variant="ghost"
        className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
        title="Copier le lien de parrainage"
      >
        {copied ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  )
}
