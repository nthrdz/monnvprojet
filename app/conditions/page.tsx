export default function ConditionsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
            Conditions Générales d'Utilisation
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptation des conditions</h2>
              <p>
                En utilisant Athlink, vous acceptez d'être lié par ces conditions générales 
                d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser 
                notre service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description du service</h2>
              <p>
                Athlink est une plateforme de création de profils digitaux pour les athlètes, 
                permettant de partager leurs performances, gérer leurs sponsors et développer 
                leur communauté.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Inscription et compte</h2>
              <h3 className="text-xl font-semibold mb-3">3.1 Création de compte</h3>
              <p>Pour utiliser Athlink, vous devez :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Être âgé d'au moins 13 ans</li>
                <li>Fournir des informations exactes et complètes</li>
                <li>Maintenir la sécurité de votre compte</li>
                <li>Être responsable de toutes les activités sur votre compte</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">3.2 Utilisation acceptable</h3>
              <p>Vous vous engagez à :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Utiliser le service conformément à la loi</li>
                <li>Ne pas publier de contenu illégal, offensant ou nuisible</li>
                <li>Respecter les droits d'autrui</li>
                <li>Ne pas tenter de compromettre la sécurité du service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Contenu utilisateur</h2>
              <h3 className="text-xl font-semibold mb-3">4.1 Responsabilité</h3>
              <p>
                Vous êtes seul responsable du contenu que vous publiez. Vous garantissez 
                que vous détenez tous les droits nécessaires sur ce contenu.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">4.2 Licence</h3>
              <p>
                En publiant du contenu, vous nous accordez une licence non exclusive 
                pour l'utiliser dans le cadre de notre service.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">4.3 Contenu interdit</h3>
              <p>Il est interdit de publier :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Du contenu illégal ou nuisible</li>
                <li>Du contenu violent ou pornographique</li>
                <li>Du spam ou de la publicité non autorisée</li>
                <li>Du contenu portant atteinte aux droits d'autrui</li>
                <li>Des informations personnelles d'autres personnes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Tarifs et paiements</h2>
              <h3 className="text-xl font-semibold mb-3">5.1 Plans tarifaires</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Plan Free :</strong> Gratuit avec fonctionnalités limitées</li>
                <li><strong>Plan Pro :</strong> 9,90€/mois (99€/an)</li>
                <li><strong>Plan Elite :</strong> 25,90€/mois (259€/an)</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">5.2 Facturation</h3>
              <p>
                Les paiements sont facturés à l'avance. Les tarifs peuvent être modifiés 
                avec un préavis de 30 jours.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">5.3 Remboursements</h3>
              <p>
                Les remboursements sont traités selon notre politique de remboursement. 
                Contactez-nous pour toute demande.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Propriété intellectuelle</h2>
              <p>
                Athlink et son contenu sont protégés par le droit d'auteur et autres 
                droits de propriété intellectuelle. Vous ne pouvez pas utiliser notre 
                marque sans autorisation écrite.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation de responsabilité</h2>
              <p>
                Athlink est fourni "en l'état". Nous ne garantissons pas que le service 
                sera ininterrompu ou exempt d'erreurs. Notre responsabilité est limitée 
                au montant que vous avez payé pour le service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Suspension et résiliation</h2>
              <p>
                Nous pouvons suspendre ou résilier votre compte en cas de violation 
                de ces conditions. Vous pouvez résilier votre compte à tout moment.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Données personnelles</h2>
              <p>
                Le traitement de vos données personnelles est régi par notre 
                <a href="/confidentialite" className="text-blue-600 hover:underline">
                  Politique de Confidentialité
                </a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Loi applicable</h2>
              <p>
                Ces conditions sont régies par le droit français. Tout litige sera 
                soumis à la juridiction des tribunaux français.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modifications</h2>
              <p>
                Nous pouvons modifier ces conditions à tout moment. Les modifications 
                importantes vous seront notifiées par e-mail ou via notre service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact</h2>
              <p>
                Pour toute question concernant ces conditions :
              </p>
              <div className="bg-gray-100 p-4 rounded-lg mt-4">
                <p><strong>E-mail :</strong> legal@athlink.app</p>
                <p><strong>Adresse :</strong> Athlink, France</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
