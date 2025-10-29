export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
            Politique de Confidentialité
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                Athlink s'engage à protéger votre vie privée. Cette politique de confidentialité 
                explique comment nous collectons, utilisons et protégeons vos informations personnelles 
                lorsque vous utilisez notre service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Informations que nous collectons</h2>
              <h3 className="text-xl font-semibold mb-3">2.1 Informations fournies directement</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Nom et prénom</li>
                <li>Adresse e-mail</li>
                <li>Informations de profil (photo, bio, localisation)</li>
                <li>Informations de paiement (gérées par nos prestataires sécurisés)</li>
                <li>Contenu que vous publiez (photos, vidéos, textes)</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">2.2 Informations collectées automatiquement</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Adresse IP et informations de connexion</li>
                <li>Données d'utilisation et analytics</li>
                <li>Cookies et technologies similaires</li>
                <li>Informations sur votre appareil et navigateur</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilisation de vos informations</h2>
              <p>Nous utilisons vos informations pour :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Fournir et améliorer nos services</li>
                <li>Personnaliser votre expérience utilisateur</li>
                <li>Communiquer avec vous sur nos services</li>
                <li>Traiter les paiements et gérer votre compte</li>
                <li>Respecter nos obligations légales</li>
                <li>Prévenir la fraude et assurer la sécurité</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Partage de vos informations</h2>
              <p>
                Nous ne vendons jamais vos informations personnelles. Nous pouvons partager 
                vos informations dans les cas suivants :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Avec votre consentement explicite</li>
                <li>Avec nos prestataires de services (sous contrat de confidentialité)</li>
                <li>Pour respecter une obligation légale</li>
                <li>Pour protéger nos droits et la sécurité</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sécurité des données</h2>
              <p>
                Nous mettons en place des mesures de sécurité techniques et organisationnelles 
                appropriées pour protéger vos informations contre l'accès non autorisé, 
                la modification, la divulgation ou la destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Vos droits</h2>
              <p>Conformément au RGPD, vous avez le droit de :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Accéder à vos données personnelles</li>
                <li>Rectifier vos données</li>
                <li>Supprimer vos données</li>
                <li>Limiter le traitement</li>
                <li>Portabilité des données</li>
                <li>Vous opposer au traitement</li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous à : 
                <a href="mailto:privacy@athlink.app" className="text-blue-600 hover:underline">
                  privacy@athlink.app
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
              <p>
                Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez 
                gérer vos préférences de cookies dans les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Conservation des données</h2>
              <p>
                Nous conservons vos données aussi longtemps que nécessaire pour fournir 
                nos services et respecter nos obligations légales.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications</h2>
              <p>
                Nous pouvons modifier cette politique de confidentialité. Les modifications 
                importantes vous seront notifiées par e-mail ou via notre service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact</h2>
              <p>
                Pour toute question concernant cette politique de confidentialité :
              </p>
              <div className="bg-gray-100 p-4 rounded-lg mt-4">
                <p><strong>E-mail :</strong> privacy@athlink.app</p>
                <p><strong>Adresse :</strong> Athlink, France</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
