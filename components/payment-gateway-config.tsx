"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  Settings,
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
} from "lucide-react"
import { PaymentConfigService, type PaymentGatewayConfig } from "@/lib/payment-config"

export function PaymentGatewayConfig() {
  const [config, setConfig] = useState<PaymentGatewayConfig>(PaymentConfigService.getDefaultConfig())
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [testResults, setTestResults] = useState<{
    paypal: { success: boolean; message: string; tested: boolean }
    stripe: { success: boolean; message: string; tested: boolean }
  }>({
    paypal: { success: false, message: "", tested: false },
    stripe: { success: false, message: "", tested: false },
  })
  const [showSecrets, setShowSecrets] = useState({
    paypalSecret: false,
    stripeSecret: false,
    webhookSecret: false,
  })
  const [validationErrors, setValidationErrors] = useState<{
    paypal: string[]
    stripe: string[]
  }>({
    paypal: [],
    stripe: [],
  })

  useEffect(() => {
    loadConfig()
  }, [])

  useEffect(() => {
    validateConfig()
  }, [config])

  const loadConfig = () => {
    const savedConfig = PaymentConfigService.getConfig()
    setConfig(savedConfig)
  }

  const validateConfig = () => {
    const paypalErrors = PaymentConfigService.validatePayPalConfig(config.paypal)
    const stripeErrors = PaymentConfigService.validateStripeConfig(config.stripe)

    setValidationErrors({
      paypal: paypalErrors,
      stripe: stripeErrors,
    })
  }

  const saveConfig = async () => {
    setSaveStatus("saving")
    try {
      const success = PaymentConfigService.saveConfig(config)
      if (success) {
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      } else {
        setSaveStatus("error")
        setTimeout(() => setSaveStatus("idle"), 2000)
      }
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }
  }

  const testPayPalConnection = async () => {
    setTestResults((prev) => ({
      ...prev,
      paypal: { ...prev.paypal, tested: false },
    }))

    const result = await PaymentConfigService.testPayPalConnection(config.paypal)

    setTestResults((prev) => ({
      ...prev,
      paypal: { ...result, tested: true },
    }))
  }

  const testStripeConnection = async () => {
    setTestResults((prev) => ({
      ...prev,
      stripe: { ...prev.stripe, tested: false },
    }))

    const result = await PaymentConfigService.testStripeConnection(config.stripe)

    setTestResults((prev) => ({
      ...prev,
      stripe: { ...result, tested: true },
    }))
  }

  const updatePayPalConfig = (updates: Partial<PaymentGatewayConfig["paypal"]>) => {
    setConfig((prev) => ({
      ...prev,
      paypal: { ...prev.paypal, ...updates },
    }))
  }

  const updateStripeConfig = (updates: Partial<PaymentGatewayConfig["stripe"]>) => {
    setConfig((prev) => ({
      ...prev,
      stripe: { ...prev.stripe, ...updates },
    }))
  }

  const updateGeneralConfig = (updates: Partial<PaymentGatewayConfig["general"]>) => {
    setConfig((prev) => ({
      ...prev,
      general: { ...prev.general, ...updates },
    }))
  }

  const getStatusBadge = (enabled: boolean, errors: string[]) => {
    if (!enabled) {
      return <Badge variant="secondary">Désactivé</Badge>
    }
    if (errors.length > 0) {
      return <Badge className="bg-red-500">Configuration incomplète</Badge>
    }
    return <Badge className="bg-green-500">Actif</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuration des paiements</h2>
          <p className="text-gray-600">Configurez PayPal et Stripe pour accepter les paiements</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadConfig}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Recharger
          </Button>
          <Button onClick={saveConfig} disabled={saveStatus === "saving"}>
            <Save className="h-4 w-4 mr-2" />
            {saveStatus === "saving" ? "Sauvegarde..." : saveStatus === "saved" ? "Sauvegardé !" : "Sauvegarder"}
          </Button>
        </div>
      </div>

      {/* Aperçu des passerelles */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">PayPal</h3>
                  <p className="text-sm text-gray-500">Paiements PayPal</p>
                </div>
              </div>
              {getStatusBadge(config.paypal.enabled, validationErrors.paypal)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Stripe</h3>
                  <p className="text-sm text-gray-500">Cartes bancaires</p>
                </div>
              </div>
              {getStatusBadge(config.stripe.enabled, validationErrors.stripe)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration détaillée */}
      <Tabs defaultValue="paypal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="general">Général</TabsTrigger>
        </TabsList>

        {/* Configuration PayPal */}
        <TabsContent value="paypal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Configuration PayPal
                </div>
                <Switch
                  checked={config.paypal.enabled}
                  onCheckedChange={(enabled) => updatePayPalConfig({ enabled })}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mode */}
              <div>
                <Label htmlFor="paypal-mode">Mode</Label>
                <select
                  id="paypal-mode"
                  className="w-full p-2 border rounded-md"
                  value={config.paypal.mode}
                  onChange={(e) => updatePayPalConfig({ mode: e.target.value as "sandbox" | "live" })}
                >
                  <option value="sandbox">Sandbox (Test)</option>
                  <option value="live">Live (Production)</option>
                </select>
              </div>

              {/* Client ID */}
              <div>
                <Label htmlFor="paypal-client-id">Client ID</Label>
                <Input
                  id="paypal-client-id"
                  placeholder="AXxxx..."
                  value={config.paypal.clientId}
                  onChange={(e) => updatePayPalConfig({ clientId: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Trouvez votre Client ID dans votre tableau de bord PayPal Developer
                </p>
              </div>

              {/* Client Secret */}
              <div>
                <Label htmlFor="paypal-client-secret">Client Secret</Label>
                <div className="relative">
                  <Input
                    id="paypal-client-secret"
                    type={showSecrets.paypalSecret ? "text" : "password"}
                    placeholder="EXxxx..."
                    value={config.paypal.clientSecret}
                    onChange={(e) => updatePayPalConfig({ clientSecret: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowSecrets((prev) => ({ ...prev, paypalSecret: !prev.paypalSecret }))}
                  >
                    {showSecrets.paypalSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Webhook ID */}
              <div>
                <Label htmlFor="paypal-webhook">Webhook ID (Optionnel)</Label>
                <Input
                  id="paypal-webhook"
                  placeholder="WH-xxx..."
                  value={config.paypal.webhookId || ""}
                  onChange={(e) => updatePayPalConfig({ webhookId: e.target.value })}
                />
              </div>

              {/* Devise */}
              <div>
                <Label htmlFor="paypal-currency">Devise</Label>
                <select
                  id="paypal-currency"
                  className="w-full p-2 border rounded-md"
                  value={config.paypal.currency}
                  onChange={(e) => updatePayPalConfig({ currency: e.target.value })}
                >
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - Dollar US</option>
                  <option value="GBP">GBP - Livre Sterling</option>
                </select>
              </div>

              {/* Erreurs de validation */}
              {validationErrors.paypal.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm font-medium text-red-800">Erreurs de configuration :</span>
                  </div>
                  <ul className="mt-2 text-sm text-red-700">
                    {validationErrors.paypal.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Test de connexion */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Test de connexion</h4>
                    <p className="text-sm text-gray-500">Vérifiez que vos identifiants sont corrects</p>
                  </div>
                  <Button onClick={testPayPalConnection} disabled={!config.paypal.enabled}>
                    <TestTube className="h-4 w-4 mr-2" />
                    Tester
                  </Button>
                </div>

                {testResults.paypal.tested && (
                  <div
                    className={`mt-3 p-3 rounded-md ${testResults.paypal.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                  >
                    <div className="flex items-center">
                      {testResults.paypal.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className={`text-sm ${testResults.paypal.success ? "text-green-800" : "text-red-800"}`}>
                        {testResults.paypal.message}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Stripe */}
        <TabsContent value="stripe">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Configuration Stripe
                </div>
                <Switch
                  checked={config.stripe.enabled}
                  onCheckedChange={(enabled) => updateStripeConfig({ enabled })}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mode */}
              <div>
                <Label htmlFor="stripe-mode">Mode</Label>
                <select
                  id="stripe-mode"
                  className="w-full p-2 border rounded-md"
                  value={config.stripe.mode}
                  onChange={(e) => updateStripeConfig({ mode: e.target.value as "test" | "live" })}
                >
                  <option value="test">Test</option>
                  <option value="live">Live (Production)</option>
                </select>
              </div>

              {/* Clé publique */}
              <div>
                <Label htmlFor="stripe-publishable">Clé publique</Label>
                <Input
                  id="stripe-publishable"
                  placeholder="pk_test_xxx ou pk_live_xxx"
                  value={config.stripe.publishableKey}
                  onChange={(e) => updateStripeConfig({ publishableKey: e.target.value })}
                />
              </div>

              {/* Clé secrète */}
              <div>
                <Label htmlFor="stripe-secret">Clé secrète</Label>
                <div className="relative">
                  <Input
                    id="stripe-secret"
                    type={showSecrets.stripeSecret ? "text" : "password"}
                    placeholder="sk_test_xxx ou sk_live_xxx"
                    value={config.stripe.secretKey}
                    onChange={(e) => updateStripeConfig({ secretKey: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowSecrets((prev) => ({ ...prev, stripeSecret: !prev.stripeSecret }))}
                  >
                    {showSecrets.stripeSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Webhook Secret */}
              <div>
                <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                <div className="relative">
                  <Input
                    id="stripe-webhook"
                    type={showSecrets.webhookSecret ? "text" : "password"}
                    placeholder="whsec_xxx"
                    value={config.stripe.webhookSecret}
                    onChange={(e) => updateStripeConfig({ webhookSecret: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowSecrets((prev) => ({ ...prev, webhookSecret: !prev.webhookSecret }))}
                  >
                    {showSecrets.webhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Configurez un webhook dans votre tableau de bord Stripe</p>
              </div>

              {/* Devise */}
              <div>
                <Label htmlFor="stripe-currency">Devise</Label>
                <select
                  id="stripe-currency"
                  className="w-full p-2 border rounded-md"
                  value={config.stripe.currency}
                  onChange={(e) => updateStripeConfig({ currency: e.target.value })}
                >
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - Dollar US</option>
                  <option value="GBP">GBP - Livre Sterling</option>
                </select>
              </div>

              {/* Erreurs de validation */}
              {validationErrors.stripe.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm font-medium text-red-800">Erreurs de configuration :</span>
                  </div>
                  <ul className="mt-2 text-sm text-red-700">
                    {validationErrors.stripe.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Test de connexion */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Test de connexion</h4>
                    <p className="text-sm text-gray-500">Vérifiez que vos clés API sont correctes</p>
                  </div>
                  <Button onClick={testStripeConnection} disabled={!config.stripe.enabled}>
                    <TestTube className="h-4 w-4 mr-2" />
                    Tester
                  </Button>
                </div>

                {testResults.stripe.tested && (
                  <div
                    className={`mt-3 p-3 rounded-md ${testResults.stripe.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                  >
                    <div className="flex items-center">
                      {testResults.stripe.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className={`text-sm ${testResults.stripe.success ? "text-green-800" : "text-red-800"}`}>
                        {testResults.stripe.message}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration générale */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Paramètres généraux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default-currency">Devise par défaut</Label>
                  <select
                    id="default-currency"
                    className="w-full p-2 border rounded-md"
                    value={config.general.defaultCurrency}
                    onChange={(e) => updateGeneralConfig({ defaultCurrency: e.target.value })}
                  >
                    <option value="EUR">EUR - Euro</option>
                    <option value="USD">USD - Dollar US</option>
                    <option value="GBP">GBP - Livre Sterling</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="tax-rate">Taux de TVA (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={config.general.taxRate}
                    onChange={(e) => updateGeneralConfig({ taxRate: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <Label htmlFor="commission">Commission plateforme (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={config.general.commission}
                    onChange={(e) => updateGeneralConfig({ commission: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <Label htmlFor="min-amount">Montant minimum (€)</Label>
                  <Input
                    id="min-amount"
                    type="number"
                    min="0"
                    value={config.general.minimumAmount}
                    onChange={(e) => updateGeneralConfig({ minimumAmount: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <Label htmlFor="max-amount">Montant maximum (€)</Label>
                  <Input
                    id="max-amount"
                    type="number"
                    min="0"
                    value={config.general.maximumAmount}
                    onChange={(e) => updateGeneralConfig({ maximumAmount: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PaymentGatewayConfig
