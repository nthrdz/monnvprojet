import Link from "next/link"

export const metadata = {
  title: "Conditions Générales de Vente - Athlink",
  description: "Conditions Générales de Vente de la plateforme Athlink"
}

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium mb-4 inline-block">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Conditions Générales de Vente</h1>
          <p className="text-gray-600">En vigueur au 24/10/2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 1 - Champ d'application</h2>
          <p>
            Les présentes Conditions Générales de Vente (dites « CGV ») s'appliquent, sans restriction ni
            réserve à tout achat des services de suivants :
          </p>
          <p>
            Athlink propose une plateforme en ligne permettant aux utilisateurs de créer et gérer leur profil
            professionnel sportif, d'héberger leurs liens, et d'accéder à des fonctionnalités avancées selon la
            formule d'abonnement choisie.
          </p>

          <p>
            tels que proposés par le Prestataire aux clients non professionnels (« Les Clients ou le Client ») sur le
            site https://athlink.fr.
          </p>

          <p>
            Les caractéristiques principales des Services sont présentées sur le site internet https://athlink.fr.
            Le Client est tenu d'en prendre connaissance avant toute passation de commande. Le choix et l'achat
            d'un Service est de la seule responsabilité du Client.
          </p>

          <p>
            Ces CGV sont accessibles à tout moment sur le site https://athlink.fr et prévaudront sur toute autre
            document.
          </p>

          <p>
            Le Client déclare avoir pris connaissance des présentes CGV et les avoir acceptées en cochant la
            case prévue à cet effet avant la mise en œuvre de la procédure de commande en ligne du site https://
            athlink.fr.
          </p>

          <p>
            Sauf preuve contraire, les données enregistrées dans le système informatique du Prestataire
            constituent la preuve de l'ensemble des transactions conclues avec le Client.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <p className="font-semibold mb-2">Les coordonnées du Prestataire sont les suivantes :</p>
            <p>Rodriguez Nathan</p>
            <p>36 rue de la marquise</p>
            <p>Numéro d'immatriculation : 992 703 165</p>
            <p>mail : contact@athlink.fr</p>
            <p>téléphone : 0652503922</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 2 - Prix</h2>
          <p>
            Les Services sont fournis aux tarifs en vigueur figurant sur le site https://athlink.fr, lors de
            l'enregistrement de la commande par le Prestataire.
          </p>
          <p>Les prix sont exprimés en Euros, HT et TTC.</p>
          <p>
            Les tarifs tiennent compte d'éventuelles réductions qui seraient consenties par le Prestataire sur le
            site https://athlink.fr.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 3 – Commandes</h2>
          <p>
            Il appartient au Client de sélectionner sur le site https://athlink.fr les Services qu'il désire commander,
            selon les modalités suivantes :
          </p>
          <p>
            Le Client sélectionne une offre, valide sa commande, règle le paiement en ligne de manière
            sécurisée, reçoit un email de confirmation et accède immédiatement au service.
          </p>
          <p>
            La vente ne sera considérée comme valide qu'après paiement intégral du prix. Il appartient au Client
            de vérifier l'exactitude de la commande et de signaler immédiatement toute erreur.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 4 - Conditions de paiement</h2>
          <p>Le prix est payé par voie de paiement sécurisé, selon les modalités suivantes :</p>
          <ul className="list-disc pl-6">
            <li>paiement par carte bancaire</li>
          </ul>
          <p>Le prix est payable comptant par le Client, en totalité au jour de la passation de la commande.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 5 - Fourniture des Prestations</h2>
          <p>
            Les Services commandés par le Client seront fournis selon les modalités suivantes :
            Le service Athlink est fourni en ligne immédiatement après paiement et reste accessible en continu
            tant que l'abonnement est actif. La prestation est dématérialisée et disponible 24h/24, sous réserve
            de maintenance ou de force majeure.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 6 - Droit de rétractation</h2>
          <p>
            Selon les modalités de l'article L221-18 du Code de la Consommation :
            Pour les contrats prévoyant la livraison régulière de biens pendant une période définie, le délai court à
            compter de la réception du premier bien.
          </p>
          <p>
            Le droit de rétractation peut être exercé en ligne, à l'aide du formulaire de rétractation ci-joint et
            également disponible sur le site ou de toute autre déclaration, dénuée d'ambiguïté, exprimant la
            volonté de se rétracter.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 7 - Responsabilité du Prestataire - Garanties</h2>
          <p>
            Le Prestataire garantit, conformément aux dispositions légales et sans paiement complémentaire, le
            Client, contre tout défaut de conformité ou vice caché, provenant d'un défaut de conception ou de
            réalisation des Services commandés dans les conditions et selon les modalités suivantes :
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 8 - Données personnelles</h2>
          <p>
            Le Client est informé que la collecte de ses données à caractère personnel est nécessaire à la vente
            des Services et leur réalisation et délivrance, confiées au Prestataire. Ces données à caractère
            personnel sont récoltées uniquement pour l'exécution du contrat de prestations de services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 9 - Propriété intellectuelle</h2>
          <p>
            Le contenu du site https://athlink.fr est la propriété du Vendeur et de ses partenaires et est protégé
            par les lois françaises et internationales relatives à la propriété intellectuelle.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 10 - Droit applicable - Langue</h2>
          <p>
            Les présentes CGV et les opérations qui en découlent sont régies et soumises au droit français.
            Les présentes CGV sont rédigées en langue française.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">ARTICLE 11 - Litiges</h2>
          <p>
            Pour toute réclamation merci de contacter le service clientèle à l'adresse postale ou mail du
            Prestataire indiquée à l'ARTICLE 1 des présentes CGV.
          </p>

          <p className="text-sm text-gray-600 mt-8">
            Réalisé sur https://www.legalplace.fr
          </p>
        </div>
      </div>
    </div>
  )
}

