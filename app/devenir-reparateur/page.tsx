import PaymentModalEnhanced from "@/components/payment-modal-enhanced"

const DevenirReparateurPage = () => {
  return (
    <div>
      <h1>Devenir Réparateur</h1>
      <p>Rejoignez notre réseau de réparateurs et développez votre activité !</p>

      {/* Formulaire d'inscription (à implémenter) */}
      <h2>Inscription</h2>
      <p>Veuillez remplir le formulaire ci-dessous pour vous inscrire :</p>
      {/* ... Formulaire ... */}

      {/* Modal de paiement (à implémenter) */}
      <h2>Paiement</h2>
      <p>Pour finaliser votre inscription, veuillez effectuer le paiement :</p>
      <PaymentModalEnhanced />
      {/* ... Modal de paiement ... */}
    </div>
  )
}

export default DevenirReparateurPage
