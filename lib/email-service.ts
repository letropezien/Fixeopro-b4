// Service d'envoi d'emails pour FixeoPro
export interface EmailConfig {
  provider: "smtp" | "sendgrid" | "mailgun" | "resend"
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPassword?: string
  apiKey?: string
  fromEmail: string
  fromName: string
  isEnabled: boolean
  testMode: boolean
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
}

export interface ContactEmail {
  id: string
  requestId: string
  repairerId: string
  clientEmail: string
  subject: string
  message: string
  repairer: {
    name: string
    email: string
    phone?: string
    company?: string
  }
  sentAt: string
  status: "pending" | "sent" | "failed"
  errorMessage?: string
}

class EmailService {
  private config: EmailConfig | null = null

  // Charger la configuration depuis localStorage
  loadConfig(): EmailConfig {
    if (typeof window === "undefined") {
      return this.getDefaultConfig()
    }

    try {
      const saved = localStorage.getItem("fixeopro_email_config")
      if (saved) {
        this.config = JSON.parse(saved)
        return this.config!
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la config email:", error)
    }

    return this.getDefaultConfig()
  }

  // Sauvegarder la configuration
  saveConfig(config: EmailConfig): void {
    if (typeof window === "undefined") return

    try {
      this.config = config
      localStorage.setItem("fixeopro_email_config", JSON.stringify(config))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la config email:", error)
    }
  }

  // Configuration par défaut
  private getDefaultConfig(): EmailConfig {
    return {
      provider: "smtp",
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      fromEmail: "noreply@fixeopro.com",
      fromName: "FixeoPro",
      isEnabled: false,
      testMode: true,
    }
  }

  // Obtenir les templates d'emails
  getTemplates(): EmailTemplate[] {
    return [
      {
        id: "contact_client",
        name: "Contact client par réparateur",
        subject: "Nouveau message d'un réparateur - {{requestTitle}}",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #2563eb; margin: 0;">Nouveau message de réparateur</h2>
              <p style="margin: 10px 0 0 0; color: #6b7280;">Concernant votre demande de dépannage</p>
            </div>
            
            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-top: 0;">Votre demande : {{requestTitle}}</h3>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Catégorie :</strong> {{requestCategory}}</p>
              <p style="color: #6b7280; margin: 5px 0;"><strong>Localisation :</strong> {{requestLocation}}</p>
            </div>

            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-top: 0;">Message du réparateur</h3>
              <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb;">
                <p style="margin: 0; color: #374151; line-height: 1.6;">{{message}}</p>
              </div>
            </div>

            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-top: 0;">Informations du réparateur</h3>
              <p style="margin: 5px 0; color: #374151;"><strong>Nom :</strong> {{repairerName}}</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Email :</strong> {{repairerEmail}}</p>
              {{#if repairerPhone}}<p style="margin: 5px 0; color: #374151;"><strong>Téléphone :</strong> {{repairerPhone}}</p>{{/if}}
              {{#if repairerCompany}}<p style="margin: 5px 0; color: #374151;"><strong>Entreprise :</strong> {{repairerCompany}}</p>{{/if}}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="{{platformUrl}}/demande/{{requestId}}" 
                 style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Voir ma demande sur FixeoPro
              </a>
            </div>

            <div style="background: #f9fafb; padding: 15px; border-radius: 6px; text-align: center; margin-top: 30px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Cet email a été envoyé via la plateforme FixeoPro.<br>
                Si vous ne souhaitez plus recevoir ces notifications, 
                <a href="{{unsubscribeUrl}}" style="color: #2563eb;">cliquez ici</a>.
              </p>
            </div>
          </div>
        `,
        textContent: `
Nouveau message d'un réparateur

Votre demande : {{requestTitle}}
Catégorie : {{requestCategory}}
Localisation : {{requestLocation}}

Message du réparateur :
{{message}}

Informations du réparateur :
Nom : {{repairerName}}
Email : {{repairerEmail}}
{{#if repairerPhone}}Téléphone : {{repairerPhone}}{{/if}}
{{#if repairerCompany}}Entreprise : {{repairerCompany}}{{/if}}

Voir votre demande : {{platformUrl}}/demande/{{requestId}}

---
Cet email a été envoyé via FixeoPro.
        `,
        variables: [
          "requestTitle",
          "requestCategory",
          "requestLocation",
          "requestId",
          "message",
          "repairerName",
          "repairerEmail",
          "repairerPhone",
          "repairerCompany",
          "platformUrl",
          "unsubscribeUrl",
        ],
      },
      {
        id: "test_email",
        name: "Email de test",
        subject: "Test de configuration email - FixeoPro",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center;">
              <h2 style="margin: 0;">✅ Test de configuration réussi !</h2>
            </div>
            
            <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 20px;">
              <p>Félicitations ! Votre configuration email fonctionne correctement.</p>
              <p><strong>Heure du test :</strong> {{testTime}}</p>
              <p><strong>Configuration :</strong> {{provider}}</p>
              <p><strong>Serveur :</strong> {{server}}</p>
            </div>

            <div style="background: #f9fafb; padding: 15px; border-radius: 6px; text-align: center; margin-top: 20px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Email de test envoyé depuis l'interface d'administration FixeoPro
              </p>
            </div>
          </div>
        `,
        textContent: `
✅ Test de configuration réussi !

Félicitations ! Votre configuration email fonctionne correctement.

Heure du test : {{testTime}}
Configuration : {{provider}}
Serveur : {{server}}

---
Email de test envoyé depuis l'interface d'administration FixeoPro
        `,
        variables: ["testTime", "provider", "server"],
      },
      {
        id: "email_verification",
        name: "Vérification d'email",
        subject: "Vérifiez votre adresse email - FixeoPro",
        htmlContent: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563eb; color: white; padding: 20px; border-radius: 8px; text-align: center;">
        <h2 style="margin: 0;">📧 Vérifiez votre adresse email</h2>
      </div>
      
      <div style="padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 20px;">
        <p>Bonjour {{userName}},</p>
        <p>Merci de vous être inscrit sur FixeoPro ! Pour finaliser votre inscription et sécuriser votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{verificationUrl}}" 
             style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Vérifier mon email
          </a>
        </div>
        
        <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
        <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all; font-family: monospace; font-size: 14px;">
          {{verificationUrl}}
        </p>
        
        <p><strong>Important :</strong> Ce lien expire dans 24 heures pour des raisons de sécurité.</p>
      </div>

      <div style="background: #f9fafb; padding: 15px; border-radius: 6px; text-align: center; margin-top: 20px;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          Si vous n'avez pas créé de compte sur FixeoPro, vous pouvez ignorer cet email.<br>
          Cet email a été envoyé automatiquement, merci de ne pas y répondre.
        </p>
      </div>
    </div>
  `,
        textContent: `
Vérifiez votre adresse email - FixeoPro

Bonjour {{userName}},

Merci de vous être inscrit sur FixeoPro ! Pour finaliser votre inscription et sécuriser votre compte, veuillez vérifier votre adresse email en cliquant sur ce lien :

{{verificationUrl}}

Important : Ce lien expire dans 24 heures pour des raisons de sécurité.

Si vous n'avez pas créé de compte sur FixeoPro, vous pouvez ignorer cet email.

---
FixeoPro - Plateforme de mise en relation pour réparations
  `,
        variables: ["userName", "verificationUrl", "userEmail"],
      },
    ]
  }

  // Remplacer les variables dans un template
  private replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template

    // Remplacer les variables simples {{variable}}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g")
      result = result.replace(regex, value || "")
    })

    // Gérer les conditions {{#if variable}}...{{/if}}
    result = result.replace(/{{#if\s+(\w+)}}(.*?){{\/if}}/gs, (match, variable, content) => {
      return variables[variable] ? content : ""
    })

    return result
  }

  // Envoyer un email de contact
  async sendContactEmail(contactData: {
    requestId: string
    repairerId: string
    clientEmail: string
    message: string
    repairer: {
      name: string
      email: string
      phone?: string
      company?: string
    }
    request: {
      title: string
      category: string
      city: string
      postalCode: string
    }
  }): Promise<{ success: boolean; error?: string; emailId?: string }> {
    const config = this.loadConfig()

    if (!config.isEnabled) {
      return { success: false, error: "Service d'email désactivé" }
    }

    const template = this.getTemplates().find((t) => t.id === "contact_client")
    if (!template) {
      return { success: false, error: "Template email introuvable" }
    }

    const variables = {
      requestTitle: contactData.request.title,
      requestCategory: contactData.request.category,
      requestLocation: `${contactData.request.city} (${contactData.request.postalCode})`,
      requestId: contactData.requestId,
      message: contactData.message,
      repairerName: contactData.repairer.name,
      repairerEmail: contactData.repairer.email,
      repairerPhone: contactData.repairer.phone,
      repairerCompany: contactData.repairer.company,
      platformUrl: typeof window !== "undefined" ? window.location.origin : "https://fixeopro.com",
      unsubscribeUrl: `${typeof window !== "undefined" ? window.location.origin : "https://fixeopro.com"}/unsubscribe`,
    }

    const emailData = {
      to: contactData.clientEmail,
      from: `${config.fromName} <${config.fromEmail}>`,
      subject: this.replaceVariables(template.subject, variables),
      html: this.replaceVariables(template.htmlContent, variables),
      text: this.replaceVariables(template.textContent, variables),
    }

    // Créer l'enregistrement de l'email
    const emailRecord: ContactEmail = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId: contactData.requestId,
      repairerId: contactData.repairerId,
      clientEmail: contactData.clientEmail,
      subject: emailData.subject,
      message: contactData.message,
      repairer: contactData.repairer,
      sentAt: new Date().toISOString(),
      status: "pending",
    }

    try {
      // Sauvegarder l'email en attente
      this.saveEmailRecord(emailRecord)

      // Simuler l'envoi (en production, utiliser un vrai service)
      if (config.testMode) {
        console.log("📧 EMAIL SIMULÉ:", emailData)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Marquer comme envoyé
        emailRecord.status = "sent"
        this.saveEmailRecord(emailRecord)

        return { success: true, emailId: emailRecord.id }
      } else {
        // En production, utiliser le vrai service d'email
        const result = await this.sendRealEmail(emailData, config)
        emailRecord.status = result.success ? "sent" : "failed"
        if (!result.success) {
          emailRecord.errorMessage = result.error
        }
        this.saveEmailRecord(emailRecord)

        return result
      }
    } catch (error) {
      emailRecord.status = "failed"
      emailRecord.errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
      this.saveEmailRecord(emailRecord)

      return { success: false, error: emailRecord.errorMessage }
    }
  }

  // Envoyer un email de test
  async sendTestEmail(testEmail: string): Promise<{ success: boolean; error?: string }> {
    const config = this.loadConfig()

    if (!config.isEnabled) {
      return { success: false, error: "Service d'email désactivé" }
    }

    const template = this.getTemplates().find((t) => t.id === "test_email")
    if (!template) {
      return { success: false, error: "Template de test introuvable" }
    }

    const variables = {
      testTime: new Date().toLocaleString("fr-FR"),
      provider: config.provider.toUpperCase(),
      server: config.smtpHost || "API",
    }

    const emailData = {
      to: testEmail,
      from: `${config.fromName} <${config.fromEmail}>`,
      subject: this.replaceVariables(template.subject, variables),
      html: this.replaceVariables(template.htmlContent, variables),
      text: this.replaceVariables(template.textContent, variables),
    }

    try {
      if (config.testMode) {
        console.log("📧 EMAIL DE TEST SIMULÉ:", emailData)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return { success: true }
      } else {
        return await this.sendRealEmail(emailData, config)
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" }
    }
  }

  // Envoyer un email de vérification
  async sendVerificationEmail(userData: {
    email: string
    firstName: string
    lastName: string
    userId: string
  }): Promise<{ success: boolean; error?: string; token?: string }> {
    const config = this.loadConfig()

    if (!config.isEnabled) {
      return { success: false, error: "Service d'email désactivé" }
    }

    const template = this.getTemplates().find((t) => t.id === "email_verification")
    if (!template) {
      return { success: false, error: "Template de vérification introuvable" }
    }

    // Générer un token de vérification
    const token = `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const verificationUrl = `${typeof window !== "undefined" ? window.location.origin : "https://fixeopro.com"}/verify-email?token=${token}&email=${encodeURIComponent(userData.email)}`

    const variables = {
      userName: `${userData.firstName} ${userData.lastName}`,
      userEmail: userData.email,
      verificationUrl: verificationUrl,
    }

    const emailData = {
      to: userData.email,
      from: `${config.fromName} <${config.fromEmail}>`,
      subject: this.replaceVariables(template.subject, variables),
      html: this.replaceVariables(template.htmlContent, variables),
      text: this.replaceVariables(template.textContent, variables),
    }

    try {
      // Sauvegarder le token de vérification
      this.saveVerificationToken(token, userData.userId, userData.email)

      if (config.testMode) {
        console.log("📧 EMAIL DE VÉRIFICATION SIMULÉ:", emailData)
        console.log("🔗 LIEN DE VÉRIFICATION:", verificationUrl)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return { success: true, token }
      } else {
        const result = await this.sendRealEmail(emailData, config)
        return { success: result.success, error: result.error, token: result.success ? token : undefined }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" }
    }
  }

  // Sauvegarder un token de vérification
  private saveVerificationToken(token: string, userId: string, email: string): void {
    if (typeof window === "undefined") return

    try {
      const tokens = this.getVerificationTokens()
      const newToken = {
        token,
        userId,
        email,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 heures
        used: false,
      }

      // Supprimer les anciens tokens pour cet utilisateur
      const filteredTokens = tokens.filter((t) => t.userId !== userId)
      filteredTokens.push(newToken)

      localStorage.setItem("fixeopro_verification_tokens", JSON.stringify(filteredTokens))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du token:", error)
    }
  }

  // Obtenir les tokens de vérification
  getVerificationTokens(): any[] {
    if (typeof window === "undefined") return []

    try {
      const saved = localStorage.getItem("fixeopro_verification_tokens")
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error("Erreur lors du chargement des tokens:", error)
      return []
    }
  }

  // Vérifier un token
  verifyEmailToken(token: string, email: string): { success: boolean; error?: string; userId?: string } {
    try {
      const tokens = this.getVerificationTokens()
      const tokenData = tokens.find((t) => t.token === token && t.email === email && !t.used)

      if (!tokenData) {
        return { success: false, error: "Token invalide ou déjà utilisé" }
      }

      if (new Date() > new Date(tokenData.expiresAt)) {
        return { success: false, error: "Token expiré" }
      }

      // Marquer le token comme utilisé
      tokenData.used = true
      localStorage.setItem("fixeopro_verification_tokens", JSON.stringify(tokens))

      return { success: true, userId: tokenData.userId }
    } catch (error) {
      return { success: false, error: "Erreur lors de la vérification" }
    }
  }

  // Envoyer un vrai email (à implémenter selon le provider)
  private async sendRealEmail(
    emailData: any,
    config: EmailConfig,
  ): Promise<{ success: boolean; error?: string; emailId?: string }> {
    // En production, implémenter selon le provider choisi
    switch (config.provider) {
      case "smtp":
        // Utiliser nodemailer ou similar
        break
      case "sendgrid":
        // Utiliser l'API SendGrid
        break
      case "mailgun":
        // Utiliser l'API Mailgun
        break
      case "resend":
        // Utiliser l'API Resend
        break
    }

    // Pour le moment, simuler
    console.log("📧 EMAIL RÉEL (simulation):", emailData)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return { success: true, emailId: `real_${Date.now()}` }
  }

  // Sauvegarder un enregistrement d'email
  private saveEmailRecord(email: ContactEmail): void {
    if (typeof window === "undefined") return

    try {
      const emails = this.getEmailHistory()
      const existingIndex = emails.findIndex((e) => e.id === email.id)

      if (existingIndex >= 0) {
        emails[existingIndex] = email
      } else {
        emails.push(email)
      }

      localStorage.setItem("fixeopro_email_history", JSON.stringify(emails))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'email:", error)
    }
  }

  // Obtenir l'historique des emails
  getEmailHistory(): ContactEmail[] {
    if (typeof window === "undefined") return []

    try {
      const saved = localStorage.getItem("fixeopro_email_history")
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error)
      return []
    }
  }

  // Tester la configuration
  async testConfiguration(): Promise<{ success: boolean; error?: string }> {
    const config = this.loadConfig()

    if (!config.isEnabled) {
      return { success: false, error: "Service d'email désactivé" }
    }

    try {
      // Simuler un test de connexion
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (config.testMode) {
        return { success: true }
      }

      // En production, tester la vraie connexion
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Erreur de connexion" }
    }
  }
}

export const emailService = new EmailService()
