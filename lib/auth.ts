import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/db"
import { compare } from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

            return {
              id: user.id,
              email: user.email,
              name: user.name || "",
            }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Si connexion avec Google
      if (account?.provider === "google") {
        try {
          // Vérifier si l'utilisateur existe déjà
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { profile: true }
          })

          // Si l'utilisateur existe mais n'a pas de profil, le créer
          if (existingUser && !existingUser.profile) {
            // Générer un username unique à partir de l'email
            const baseUsername = user.email!.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
            let username = baseUsername
            let counter = 1
            
            // Vérifier l'unicité du username
            while (await prisma.profile.findUnique({ where: { username } })) {
              username = `${baseUsername}${counter}`
              counter++
            }

            await prisma.profile.create({
              data: {
                userId: existingUser.id,
                username: username,
                displayName: user.name || user.email!.split('@')[0],
                sport: "RUNNING", // Sport par défaut
                plan: "FREE",
                isPublic: true
              }
            })
          }
          
          return true
        } catch (error) {
          console.error("Erreur lors de la création du profil Google:", error)
          return false
        }
      }
      
      return true
    },
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = (token.name as string | null) || ""
        session.user.email = token.email as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    }
  }
})
