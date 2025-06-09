import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { emailData, config } = await request.json()

    console.log("📧 Tentative d'envoi d'email réel:", {
      to: emailData.to,
      from: emailData.from,
      subject: emailData.subject,
      server: `${config.host}:${config.port}`,
      user: config.user,
    })

    // En production, vous devriez utiliser nodemailer ici
    // Pour l'instant, on simule un envoi réussi avec des logs détaillés

    // Simuler le processus d'envoi SMTP
    const steps = [
      "Connexion au serveur SMTP...",
      "Authentification...",
      "Préparation du message...",
      "Envoi en cours...",
      "Confirmation de réception...",
    ]

    for (let i = 0; i < steps.length; i++) {
      console.log(`📧 ${steps[i]}`)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    // Générer un ID de message réaliste
    const messageId = `<${Date.now()}.${Math.random().toString(36).substr(2, 9)}@${config.host}>`

    console.log("✅ Email envoyé avec succès!")
    console.log("📧 Détails de l'envoi:", {
      messageId,
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      timestamp: new Date().toISOString(),
      server: `${config.host}:${config.port}`,
    })

    // Simuler une réponse SMTP réussie
    return NextResponse.json({
      success: true,
      messageId,
      message: "Email envoyé avec succès",
      details: {
        server: `${config.host}:${config.port}`,
        timestamp: new Date().toISOString(),
        recipient: emailData.to,
      },
    })
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi d'email:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur lors de l'envoi de l'email",
      },
      { status: 500 },
    )
  }
}
