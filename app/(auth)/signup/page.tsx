"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { signupSchema, type SignupInput } from "@/lib/validations"
import { toast } from "sonner"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check, X, Loader2 } from "lucide-react"

// Local Zod resolver
const zodResolver = (schema: any) => async (values: unknown) => {
  const result = schema.safeParse(values)
  if (result.success) {
    return { values: result.data, errors: {} }
  }
  const fieldErrors: Record<string, any> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.join('.')
    fieldErrors[path] = { type: 'validation', message: issue.message }
  }
  return { values: {}, errors: fieldErrors }
}

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // 🎯 CODE PROMO - SYSTÈME SIMPLIFIÉ
  const [promoCode, setPromoCode] = useState("")
  const [isCheckingPromo, setIsCheckingPromo] = useState(false)
  const [promoValid, setPromoValid] = useState<boolean | null>(null)
  const [promoDetails, setPromoDetails] = useState<any>(null)

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      username: "",
      sport: ""
    }
  })

  // 🔍 VÉRIFIER LE CODE PROMO
  const checkPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Entrez un code promo")
      return
    }

    setIsCheckingPromo(true)
    setPromoValid(null)
    setPromoDetails(null)

    console.log("🔍 Vérification code promo:", promoCode.trim().toUpperCase())

    try {
      const res = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim().toUpperCase() })
      })

      const data = await res.json()
      console.log("📥 Réponse validation:", data)

      if (data.valid) {
        setPromoValid(true)
        setPromoDetails(data)
        toast.success(`✅ Code "${data.code}" valide : ${data.discount}`, {
          duration: 3000
        })
      } else {
        setPromoValid(false)
        setPromoDetails(null)
        toast.error(data.error || "Code promo invalide")
      }
    } catch (error) {
      console.error("❌ Erreur vérification:", error)
      setPromoValid(false)
      setPromoDetails(null)
      toast.error("Erreur lors de la vérification")
    } finally {
      setIsCheckingPromo(false)
    }
  }

  // 📝 INSCRIPTION
  async function onSubmit(values: SignupInput) {
    setIsLoading(true)
    
    try {
      console.log("📤 Début inscription:", {
        hasPromo: promoValid,
        promoCode: promoCode.trim().toUpperCase()
      })

      // Choisir l'endpoint selon si code promo valide ou non
      const endpoint = promoValid ? "/api/promo-codes/apply" : "/api/auth/signup"
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          ...(promoValid && { promoCode: promoCode.trim().toUpperCase() })
        }),
      })

      const data = await res.json()
      console.log("📥 Réponse inscription:", data)

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription")
      }

      // Message de succès
      if (promoValid && data.promoApplied) {
        toast.success(`🎉 Compte créé avec code promo ${data.promoCode} (${data.discount}) !`, {
          duration: 4000
        })
      } else {
        toast.success("✅ Compte créé avec succès !", {
          duration: 3000
        })
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
            {/* Nom complet */}
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

            {/* Username */}
            <div>
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700 mb-2 block">
                Nom d&apos;utilisateur
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 whitespace-nowrap font-medium">athlink.app/</span>
                <Input 
                  id="username" 
                  {...form.register("username")} 
                  placeholder="thomasdupont"
                  className="h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 transition-colors flex-1"
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
                Sport principal
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

            {/* Mot de passe */}
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

            {/* 🎯 CODE PROMO - NOUVEAU DESIGN SIMPLIFIÉ */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 block">
                Code promo (optionnel)
              </Label>
              
              <div className="flex gap-2">
                <Input
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase())
                    setPromoValid(null)
                    setPromoDetails(null)
                  }}
                  placeholder="Entrez votre code"
                  disabled={isCheckingPromo}
                  className="h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 transition-colors uppercase"
                />
                <Button
                  type="button"
                  onClick={checkPromoCode}
                  disabled={!promoCode.trim() || isCheckingPromo}
                  className="h-12 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                >
                  {isCheckingPromo ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Vérifier"
                  )}
                </Button>
              </div>

              {/* État du code promo */}
              {promoValid === true && promoDetails && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-500 rounded-xl">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900">
                      Code valide : {promoDetails.code}
                    </p>
                    <p className="text-xs text-green-700">
                      {promoDetails.discount} • {promoDetails.description}
                    </p>
                  </div>
                </div>
              )}

              {promoValid === false && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-500 rounded-xl">
                  <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-red-900">
                    Code invalide ou expiré
                  </p>
                </div>
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
                className="w-full h-12 flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-colors bg-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            </>
          )}

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Se connecter
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-quaternary-600 to-tertiary-600 items-center justify-center p-16 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Ton parcours commence ici
            </h2>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
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
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
