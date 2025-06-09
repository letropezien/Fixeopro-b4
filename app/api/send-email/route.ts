import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { emailData, config } = await request.json()

    console.log("📧 API d'envoi d'email appelée:", {
      to: emailData.to,
      from: emailData.from,
      subject: emailData.subject,
      server: `${config.smtpHost}:${config.smtpPort}`,
    })

    // Simuler l'envoi d'email avec nodemailer
    // En production, vous devriez installer nodemailer et l'utiliser ici

    // Simulation d'envoi réussi
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log("✅ Email simulé envoyé avec succès, ID:", messageId)

    return NextResponse.json({
      success: true,
      messageId,
      message: "Email envoyé avec succès (simulation)",
    })
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi d'email:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de l'envoi de l'email" }, { status: 500 })
  }
}
