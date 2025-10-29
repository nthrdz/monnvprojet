import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Traiter les événements Stripe
    switch (event.type) {
      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account)
        break
        
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
        
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
        
      case 'transfer.created':
        await handleTransferCreated(event.data.object as Stripe.Transfer)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Gestionnaire pour la mise à jour du compte
async function handleAccountUpdated(account: Stripe.Account) {
  try {
    await prisma.affiliate.updateMany({
      where: { stripeAccountId: account.id },
      data: {
        status: account.details_submitted ? 'APPROVED' : 'PENDING'
      }
    })
    console.log(`Account ${account.id} updated`)
  } catch (error) {
    console.error('Error updating account:', error)
  }
}

// Gestionnaire pour les paiements réussis
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Trouver l'affilié lié à ce paiement
    const affiliate = await prisma.affiliate.findFirst({
      where: {
        referrals: {
          some: {
            stripePaymentIntentId: paymentIntent.id
          }
        }
      }
    })

    if (affiliate) {
      // Mettre à jour les statistiques
      await prisma.affiliate.update({
        where: { id: affiliate.id },
        data: {
          totalConversions: { increment: 1 },
          totalEarnings: { increment: (paymentIntent.amount * affiliate.commissionRate) / 100 }
        }
      })

      // Créer une commission
      await prisma.commission.create({
        data: {
          affiliateId: affiliate.id,
          amount: (paymentIntent.amount * affiliate.commissionRate) / 100,
          type: 'REFERRAL',
          status: 'PENDING',
          description: `Commission pour paiement ${paymentIntent.id}`,
          stripePaymentIntentId: paymentIntent.id
        }
      })
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

// Gestionnaire pour les factures payées
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    if ((invoice as any).subscription) {
      // Traiter l'abonnement payé
      await handleSubscriptionPayment((invoice as any).subscription as string, invoice.amount_paid)
    }
  } catch (error) {
    console.error('Error handling invoice payment:', error)
  }
}

// Gestionnaire pour les nouveaux abonnements
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    // Trouver l'affilié lié à cet abonnement
    const affiliate = await prisma.affiliate.findFirst({
      where: {
        referrals: {
          some: {
            stripeSubscriptionId: subscription.id
          }
        }
      }
    })

    if (affiliate) {
      // Calculer la commission
      const commissionAmount = (subscription.items.data[0].price.unit_amount! * affiliate.commissionRate) / 100
      
      // Créer une commission
      await prisma.commission.create({
        data: {
          affiliateId: affiliate.id,
          amount: commissionAmount,
          type: 'REFERRAL',
          status: 'PENDING',
          description: `Commission pour abonnement ${subscription.id}`,
          stripeSubscriptionId: subscription.id
        }
      })
    }
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

// Gestionnaire pour les transferts (commissions payées)
async function handleTransferCreated(transfer: Stripe.Transfer) {
  try {
    // Trouver l'affilié
    const affiliate = await prisma.affiliate.findFirst({
      where: { stripeAccountId: transfer.destination as string }
    })

    if (affiliate) {
      // Marquer les commissions comme payées
      await prisma.commission.updateMany({
        where: {
          affiliateId: affiliate.id,
          status: 'PENDING'
        },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          paymentMethod: 'stripe_transfer',
          paymentReference: transfer.id
        }
      })
    }
  } catch (error) {
    console.error('Error handling transfer created:', error)
  }
}

// Fonction utilitaire pour gérer les paiements d'abonnement
async function handleSubscriptionPayment(subscriptionId: string, amount: number) {
  try {
    const affiliate = await prisma.affiliate.findFirst({
      where: {
        referrals: {
          some: {
            stripeSubscriptionId: subscriptionId
          }
        }
      }
    })

    if (affiliate) {
      const commissionAmount = (amount * affiliate.commissionRate) / 100
      
      await prisma.commission.create({
        data: {
          affiliateId: affiliate.id,
          amount: commissionAmount,
          type: 'REFERRAL',
          status: 'PENDING',
          description: `Commission pour abonnement récurrent ${subscriptionId}`,
          stripeSubscriptionId: subscriptionId
        }
      })
    }
  } catch (error) {
    console.error('Error handling subscription payment:', error)
  }
}



