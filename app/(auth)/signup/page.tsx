"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, type SignupInput } from "@/lib/validations"
import { toast } from "sonner"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { PromoCodeField } from "@/components/ui-pro/promo-code-field"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoData, setPromoData] = useState<any>(null)

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      username: "",
      sport: "",
      referralCode: ""
    }
  })

  async function onSubmit(values: SignupInput) {
    setIsLoading(true)
    
    try {
      // Si un code promo valide est saisi, utiliser l'API promo
      const endpoint = promoData?.valid ? "/api/promo-codes/apply" : "/api/auth/signup"
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          ...(promoData?.valid && { promoCode })
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription")
      }

      // Message de succès personnalisé selon le code promo
      if (promoData?.valid) {
        if (promoData.type === "plan_upgrade") {
          toast.success(`🎉 Compte créé avec accès ${promoData.plan} !`)
        } else if (promoData.type === "trial") {
          toast.success(`🎁 Compte créé avec ${promoData.duration} jours gratuits ${promoData.plan} !`)
        } else {
          toast.success("Compte créé ! Redirection...")
        }
      } else {
        toast.success("Compte créé ! Redirection...")
      }
      
      router.push("/login")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative overflow-y-auto">
        {/* Logo */}
        <Link href="/" className="absolute top-10 left-10 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-hero" />
          <span className="font-black text-2xl bg-gradient-hero bg-clip-text text-transparent">
            Athlink
          </span>
        </Link>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md my-20"
        >
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary-600 to-quaternary-600 bg-clip-text text-transparent mb-4">
              Crée ton profil
            </h1>
            <p className="text-lg text-gray-600">
              Rejoins des milliers d&apos;athlètes
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                Nom complet
              </Label>
              <Input 
                id="name" 
                {...form.register("name")} 
                placeholder="Thomas Dupont"
                className="h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 transition-colors"
              />
              {form.formState.errors.name && (
                  <p className="text-sm text-danger-600 mt-2 font-medium">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700 mb-2 block">
                Nom d&apos;utilisateur
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 whitespace-nowrap font-medium">athlink.app/</span>
                <Input 
                  id="username" 
                  {...form.register("username")} 
                  placeholder="thomas-runner"
                  className="flex-1 h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-brand-blue-500 transition-colors"
                />
              </div>
              {form.formState.errors.username && (
                  <p className="text-sm text-danger-600 mt-2 font-medium">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="sport" className="text-sm font-semibold text-gray-700 mb-2 block">
                Sport principal
              </Label>
              <Input 
                id="sport" 
                {...form.register("sport")} 
                placeholder="Course à pied, Cyclisme, Natation, Triathlon, Ski..."
                className="h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 transition-colors"
              />
              {form.formState.errors.sport && (
                  <p className="text-sm text-danger-600 mt-2 font-medium">
                  {form.formState.errors.sport.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="referralCode" className="text-sm font-semibold text-gray-700 mb-2 block">
                Code de parrainage (optionnel)
              </Label>
              <Input 
                id="referralCode" 
                {...form.register("referralCode")} 
                placeholder="AMB123456"
                className="h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">Code fourni par un ambassadeur</p>
              {form.formState.errors.referralCode && (
                  <p className="text-sm text-danger-600 mt-2 font-medium">
                  {form.formState.errors.referralCode.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                Email
              </Label>
              <Input 
                id="email" 
                type="email"
                {...form.register("email")} 
                placeholder="thomas@example.com"
                className="h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 transition-colors"
              />
              {form.formState.errors.email && (
                  <p className="text-sm text-danger-600 mt-2 font-medium">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-2 block">
                Mot de passe
              </Label>
              <Input 
                id="password" 
                type="password"
                {...form.register("password")} 
                placeholder="••••••••"
                className="h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">Minimum 8 caractères</p>
              {form.formState.errors.password && (
                  <p className="text-sm text-danger-600 mt-2 font-medium">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Code Promo */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Code promo (optionnel)
              </Label>
              <PromoCodeField
                value={promoCode}
                onChange={setPromoCode}
                onValidation={(isValid, data) => setPromoData(data)}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-gradient-hero hover:shadow-glow-blue text-gray-900 font-bold text-lg rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Création en cours...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Créer mon profil
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Google Sign Up - Affiché seulement si configuré */}
          {process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true" && (
            <>
              {/* Separator */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-500 font-medium">OU</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google Sign Up */}
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full h-14 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold text-base rounded-full transition-all hover:shadow-md flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                S'inscrire avec Google
              </button>
            </>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">
              Se connecter
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-premium" />
        
        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center p-16 text-gray-900">
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8"
            >
              <Sparkles className="w-10 h-10" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl font-black mb-6 leading-tight"
            >
              Rejoins la Communauté
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl opacity-90 leading-relaxed mb-8"
            >
              Crée ton profil en 2 minutes et commence à partager tes performances avec le monde entier.
            </motion.p>

            {/* Features list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4"
            >
              {[
                "Profil personnalisable à 100%",
                "Liens illimités",
                "Analytics en temps réel",
                "Gratuit pour toujours"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}