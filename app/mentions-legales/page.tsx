import Link from "next/link"

export const metadata = {
  title: "Mentions légales - Athlink",
  description: "Mentions légales de la plateforme Athlink"
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium mb-4 inline-block">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Mentions légales</h1>
          <p className="text-gray-600">En vigueur au 02/11/2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          <p>
            Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la Confiance en l'économie
            numérique, il est porté à la connaissance des utilisateurs et visiteurs, ci-après l' <strong>"Utilisateur"</strong>, du site
            https://www.athlink.fr/ , ci-après le <strong>"Site"</strong>, les présentes mentions légales.
          </p>

          <p>
            La connexion et la navigation sur le Site par l'Utilisateur implique acceptation intégrale et sans
            réserve des présentes mentions légales.
          </p>

          <p>
            Ces dernières sont accessibles sur le Site à la rubrique "Mentions légales".
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">EDITION DU SITE</h2>
          <p>
            L'édition et la direction de la publication du Site est assurée par Monsieur nathan RODRIGUEZ,
            domicilié 36 rue de la marquise, dont le numéro de téléphone est 0652503922, et l'adresse e-mail
            contact@athlink.fr.
          </p>
          <p>ci-après l'"<strong>Editeur</strong>".</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">HEBERGEUR</h2>
          <p>
            L'hébergeur du Site est la société Rodriguez Nathan, dont le siège social est situé au 36 rue de la
            marquise 83400 Hyères.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">ACCES AU SITE</h2>
          <p>
            Le Site est normalement accessible, à tout moment, à l'Utilisateur. Toutefois, l'Editeur pourra, à tout
            moment, suspendre, limiter ou interrompre le Site afin de procéder, notamment, à des mises à jour ou
            des modifications de son contenu. L'Editeur ne pourra en aucun cas être tenu responsable des
            conséquences éventuelles de cette indisponibilité sur les activités de l'Utilisateur.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">COLLECTE DES DONNEES</h2>
          <p>
            Le Site assure à l'Utilisateur une collecte et un traitement des données personnelles dans le respect
            de la vie privée conformément à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers
            aux libertés et dans le respect de la règlementation applicable en matière de traitement des données
            à caractère personnel conformément au règlement (UE) 2016/679 du Parlement européen et du
            Conseil du 27 avril 2016 (ci-après, ensemble, la <strong>"Règlementation applicable en matière de
            protection des Données à caractère personnel"</strong>).
          </p>

          <p>
            Le Client est également informé qu'il peut, également recourir à la plateforme de Règlement en Ligne
            des Litige (RLL) : <a href="https://webgate.ec.europa.eu/odr/main/index.cfm?event=main.home.show" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://webgate.ec.europa.eu/odr/main/index.cfm?event=main.home.show</a>
          </p>

          <p>
            Tous les litiges auxquels les opérations d'achat et de vente conclues en application des présentes
            CGV et qui n'auraient pas fait l'objet d'un règlement amiable entre le vendeur ou par médiation,
            seront soumis aux tribunaux compétents dans les conditions de droit commun.
          </p>

          <p className="text-sm text-gray-600 mt-8">
            Réalisé sur https://www.legalplace.fr
          </p>
        </div>
      </div>
    </div>
  )
}

