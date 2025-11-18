"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupFormSchema, type SignupFormInput } from "@/lib/validations"
import { toast } from "sonner"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check, X, Loader2, Eye, EyeOff } from "lucide-react"
import { useI18n } from "@/components/providers/i18n-provider"
import { LanguageSelector } from "@/components/language-selector"

export default function SignupPage() {
  const router = useRouter()
  const { t, locale } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // 🎯 CODE DE PARRAINAGE - Récupérer du localStorage
  const [referralCode, setReferralCode] = useState<string | null>(null)

  const form = useForm<SignupFormInput>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      username: "",
      sport: ""
    }
  })

  // 🎯 RÉCUPÉRER LE CODE DE PARRAINAGE DU LOCALSTORAGE
  useEffect(() => {
    // Récupérer le code de parrainage stocké par AffiliateTracker
    const storedReferralCode = localStorage.getItem('referralCode')
    if (storedReferralCode) {
      setReferralCode(storedReferralCode)
      console.log('🎯 Code de parrainage détecté:', storedReferralCode)
    }
  }, [])

  // 📝 INSCRIPTION
  async function onSubmit(values: SignupFormInput) {
    setIsLoading(true)
    
    try {
      console.log("📤 Début inscription")

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          ...(referralCode && { referralCode }) // 🎯 Envoyer le code de parrainage si présent
        }),
      })

      const data = await res.json()
      console.log("📥 Réponse inscription:", data)

      if (!res.ok) {
        throw new Error(data.error || t('auth.signup.error'))
      }

      // Message de succès
      toast.success(`✅ ${t('auth.signup.success')}`, {
        duration: 3000
      })
      
      // 🎯 NETTOYER le code de parrainage après inscription
      if (referralCode) {
        localStorage.removeItem('referralCode')
        console.log('🧹 Code de parrainage nettoyé du localStorage')
      }
      
      // Redirection
      setTimeout(() => {
        router.push("/login")
      }, 1500)
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue"
      console.error("❌ Erreur inscription:", message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white relative overflow-y-auto">
        {/* Logo & Language Selector */}
        <div className="absolute top-4 sm:top-6 lg:top-10 left-4 sm:left-6 lg:left-10 right-4 sm:right-6 lg:right-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-hero" />
            <span className="font-black text-xl sm:text-2xl bg-gradient-hero bg-clip-text text-transparent">
              Athlink
            </span>
          </Link>
          <LanguageSelector variant="light" />
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md my-12 sm:my-16 lg:my-20"
        >
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-primary-600 to-quaternary-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              {t('auth.signup.subtitle')}
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              {t('auth.signup.subtitle2')}
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nom complet */}
            <div>
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                {t('auth.signup.name')}
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

            {/* Username */}
            <div>
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700 mb-2 block">
                {t('auth.signup.username')}
              </Label>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap font-medium">athlink.app/</span>
                <Input 
                  id="username" 
                  {...form.register("username")} 
                  placeholder="thomasdupont"
                  className="h-12 px-3 sm:px-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 transition-colors flex-1 min-w-0"
                />
              </div>
              {form.formState.errors.username && (
                  <p className="text-sm text-danger-600 mt-2 font-medium">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            {/* Sport */}
            <div>
              <Label htmlFor="sport" className="text-sm font-semibold text-gray-700 mb-2 block">
                {t('auth.signup.sport')} {locale === 'fr' ? 'principal' : '(main)'}
              </Label>
              <select
                id="sport"
                {...form.register("sport")}
                className="h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 transition-colors w-full bg-white"
              >
                <option value="">Sélectionne ton sport</option>
                <option value="RUNNING">Course à pied</option>
                <option value="CYCLING">Cyclisme</option>
                <option value="SWIMMING">Natation</option>
                <option value="TRIATHLON">Triathlon</option>
                <option value="TRAIL">Trail</option>
                <option value="FITNESS">Fitness</option>
                <option value="CROSSFIT">CrossFit</option>
                <option value="CLIMBING">Escalade</option>
                <option value="HIKING">Randonnée</option>
                <option value="OTHER">Autre</option>
              </select>
              {form.formState.errors.sport && (
                  <p className="text-sm text-danger-600 mt-2 font-medium">
                  {form.formState.errors.sport.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                {t('auth.signup.email')}
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

            {/* Mot de passe */}
            <div>
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-2 block">
                {t('auth.signup.password')}
              </Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")} 
                  placeholder="••••••••"
                  className="h-12 px-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-primary-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Minimum 8 caractères</p>
              {form.formState.errors.password && (
                  <p className="text-sm text-danger-600 mt-2 font-medium">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 mb-2 block">
                {t('auth.signup.confirmPassword')}
              </Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register("confirmPassword")} 
                  placeholder="••••••••"
                  className="h-12 px-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-primary-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-danger-600 mt-2 font-medium">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Bouton Submit */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-gradient-hero hover:shadow-glow-blue text-gray-900 font-bold text-lg rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('common.loading')}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {t('auth.signup.submit')}
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Separator */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500 font-medium">OU</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full h-12 sm:h-14 flex items-center justify-center gap-2 sm:gap-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-colors bg-white touch-manipulation"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-semibold text-gray-700">Continuer avec Google</span>
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            {t('auth.signup.hasAccount')}{" "}
            <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              {t('auth.signup.login')}
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 items-center justify-center p-16 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gray-900 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-800 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              Ton parcours commence ici
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
              Crée ton profil athlète professionnel et partage tes performances avec le monde.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                "Profil personnalisable",
                "Suivi des performances",
                "Partenariats sponsors",
                "Communauté d'athlètes"
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-medium text-gray-900">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
