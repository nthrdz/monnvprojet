"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations"
import { toast } from "sonner"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Zap } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  async function onSubmit(values: LoginInput) {
    setIsLoading(true)
    
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Email ou mot de passe incorrect")
        return
      }

      toast.success("Connexion réussie !")
      router.push("/dashboard")
      router.refresh()
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white relative">
        {/* Logo */}
        <Link href="/" className="absolute top-4 sm:top-6 lg:top-10 left-4 sm:left-6 lg:left-10 flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-hero" />
          <span className="font-black text-xl sm:text-2xl bg-gradient-hero bg-clip-text text-transparent">
            Athlink
          </span>
        </Link>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-primary-600 to-quaternary-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              Bon retour
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Connecte-toi à ton profil athlète
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                Email
              </Label>
              <Input 
                id="email" 
                type="email"
                {...form.register("email")} 
                placeholder="thomas@example.com"
                className="h-11 sm:h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 transition-colors"
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
              {form.formState.errors.password && (
                <p className="text-sm text-danger-600 mt-2 font-medium">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-gradient-ocean hover:shadow-glow-blue text-gray-900 font-bold text-lg rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Se connecter
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Google Sign In - Affiché seulement si configuré */}
          {process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true" && (
            <>
              {/* Separator */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-500 font-medium">OU</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google Sign In */}
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
                Continuer avec Google
              </button>
            </>
          )}

          <p className="text-center text-sm text-gray-600 mt-8">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden min-h-[200px] lg:min-h-0">
        <div className="absolute inset-0 bg-gradient-hero" />
        
        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
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
              <Zap className="w-10 h-10" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl font-black mb-6 leading-tight"
            >
              Reprends là où tu t&apos;es arrêté
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl opacity-90 leading-relaxed mb-8"
            >
              Accède à ton dashboard, gère tes liens, planifie tes courses et bien plus encore.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-12"
            >
              {[
                { value: "20K+", label: "Athlètes" },
                { value: "100%", label: "Gratuit" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl font-black mb-1">{stat.value}</div>
                  <div className="text-sm opacity-70 uppercase tracking-wider font-semibold">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}