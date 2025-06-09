"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Edit,
  Trash2,
  Gift,
  Calendar,
  Users,
  TrendingUp,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Percent,
  Euro,
} from "lucide-react"
import { PromoCodeService, type PromoCode, type PromoCodeUsage } from "@/lib/promo-codes"
import { useToast } from "@/hooks/use-toast"

export default function AdminPromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [usages, setUsages] = useState<PromoCodeUsage[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null)
  const [newCode, setNewCode] = useState<Partial<PromoCode>>({
    code: "",
    description: "",
    type: "percentage",
    value: 0,
    validFrom: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    maxUses: 100,
    isActive: true,
    applicablePlans: ["all"],
  })
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setPromoCodes(PromoCodeService.getPromoCodes())
    setUsages(PromoCodeService.getPromoUsages())
  }

  const handleCreateCode = () => {
    if (!newCode.code || !newCode.description || !newCode.value) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    const codeData: PromoCode = {
      id: `promo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      code: newCode.code!.toUpperCase(),
      description: newCode.description!,
      type: newCode.type as "percentage" | "fixed",
      value: newCode.value!,
      validFrom: new Date(newCode.validFrom!).toISOString(),
      validUntil: new Date(newCode.validUntil!).toISOString(),
      maxUses: newCode.maxUses || 100,
      currentUses: 0,
      isActive: newCode.isActive !== false,
      applicablePlans: newCode.applicablePlans || ["all"],
      createdAt: new Date().toISOString(),
      createdBy: "admin",
    }

    const success = PromoCodeService.savePromoCode(codeData)
    if (success) {
      toast({
        title: "Code promo créé",
        description: `Le code ${codeData.code} a été créé avec succès.`,
      })
      setShowCreateDialog(false)
      setNewCode({
        code: "",
        description: "",
        type: "percentage",
        value: 0,
        validFrom: new Date().toISOString().split("T")[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        maxUses: 100,
        isActive: true,
        applicablePlans: ["all"],
      })
      loadData()
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de créer le code promo.",
        variant: "destructive",
      })
    }
  }

  const handleEditCode = (code: PromoCode) => {
    setEditingCode(code)
    setNewCode({
      ...code,
      validFrom: code.validFrom.split("T")[0],
      validUntil: code.validUntil.split("T")[0],
    })
    setShowCreateDialog(true)
  }

  const handleUpdateCode = () => {
    if (!editingCode || !newCode.code || !newCode.description || !newCode.value) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    const updatedCode: PromoCode = {
      ...editingCode,
      code: newCode.code!.toUpperCase(),
      description: newCode.description!,
      type: newCode.type as "percentage" | "fixed",
      value: newCode.value!,
      validFrom: new Date(newCode.validFrom!).toISOString(),
      validUntil: new Date(newCode.validUntil!).toISOString(),
      maxUses: newCode.maxUses || 100,
      isActive: newCode.isActive !== false,
      applicablePlans: newCode.applicablePlans || ["all"],
    }

    const success = PromoCodeService.savePromoCode(updatedCode)
    if (success) {
      toast({
        title: "Code promo modifié",
        description: `Le code ${updatedCode.code} a été mis à jour.`,
      })
      setShowCreateDialog(false)
      setEditingCode(null)
      setNewCode({
        code: "",
        description: "",
        type: "percentage",
        value: 0,
        validFrom: new Date().toISOString().split("T")[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        maxUses: 100,
        isActive: true,
        applicablePlans: ["all"],
      })
      loadData()
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le code promo.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCode = (codeId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce code promo ?")) {
      const success = PromoCodeService.deletePromoCode(codeId)
      if (success) {
        toast({
          title: "Code promo supprimé",
          description: "Le code promo a été supprimé avec succès.",
        })
        loadData()
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le code promo.",
          variant: "destructive",
        })
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copié",
      description: "Le code a été copié dans le presse-papiers.",
    })
  }

  const getStatusIcon = (code: PromoCode) => {
    const now = new Date()
    const validFrom = new Date(code.validFrom)
    const validUntil = new Date(code.validUntil)

    if (!code.isActive) return <XCircle className="h-4 w-4 text-red-600" />
    if (now < validFrom) return <Calendar className="h-4 w-4 text-yellow-600" />
    if (now > validUntil) return <XCircle className="h-4 w-4 text-red-600" />
    if (code.currentUses >= code.maxUses) return <AlertCircle className="h-4 w-4 text-orange-600" />
    return <CheckCircle className="h-4 w-4 text-green-600" />
  }

  const getStatusText = (code: PromoCode) => {
    const now = new Date()
    const validFrom = new Date(code.validFrom)
    const validUntil = new Date(code.validUntil)

    if (!code.isActive) return "Désactivé"
    if (now < validFrom) return "Pas encore actif"
    if (now > validUntil) return "Expiré"
    if (code.currentUses >= code.maxUses) return "Limite atteinte"
    return "Actif"
  }

  const getStatusColor = (code: PromoCode) => {
    const status = getStatusText(code)
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800"
      case "Expiré":
      case "Désactivé":
        return "bg-red-100 text-red-800"
      case "Limite atteinte":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const stats = {
    total: promoCodes.length,
    active: promoCodes.filter((c) => {
      const now = new Date()
      const validFrom = new Date(c.validFrom)
      const validUntil = new Date(c.validUntil)
      return c.isActive && now >= validFrom && now <= validUntil && c.currentUses < c.maxUses
    }).length,
    used: usages.length,
    totalSavings: usages.reduce((sum, usage) => sum + usage.discountAmount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Codes Promo</h2>
          <p className="text-gray-600">Gérez les codes de réduction pour vos abonnements</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau code
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total codes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Gift className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Codes actifs</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisations</p>
                <p className="text-2xl font-bold">{stats.used}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Économies totales</p>
                <p className="text-2xl font-bold">{stats.totalSavings.toFixed(2)}€</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="codes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="codes">Codes promo ({promoCodes.length})</TabsTrigger>
          <TabsTrigger value="usages">Utilisations ({usages.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="codes">
          <Card>
            <CardHeader>
              <CardTitle>Liste des codes promo</CardTitle>
            </CardHeader>
            <CardContent>
              {promoCodes.length > 0 ? (
                <div className="space-y-3">
                  {promoCodes.map((code) => (
                    <div key={code.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(code)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-lg">{code.code}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(code.code)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600">{code.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm">
                              {code.type === "percentage" ? (
                                <span className="flex items-center">
                                  <Percent className="h-3 w-3 mr-1" />
                                  {code.value}% de réduction
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <Euro className="h-3 w-3 mr-1" />
                                  {code.value}€ de réduction
                                </span>
                              )}
                            </span>
                            <span className="text-sm text-gray-500">
                              {code.currentUses}/{code.maxUses} utilisations
                            </span>
                            <span className="text-sm text-gray-500">
                              Expire le {new Date(code.validUntil).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(code)}>{getStatusText(code)}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => handleEditCode(code)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCode(code.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun code promo créé</p>
                  <Button onClick={() => setShowCreateDialog(true)} className="mt-4">
                    Créer le premier code
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usages">
          <Card>
            <CardHeader>
              <CardTitle>Historique des utilisations</CardTitle>
            </CardHeader>
            <CardContent>
              {usages.length > 0 ? (
                <div className="space-y-3">
                  {usages
                    .sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime())
                    .map((usage) => {
                      const code = promoCodes.find((c) => c.id === usage.promoCodeId)
                      return (
                        <div key={usage.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{code?.code || "Code supprimé"}</p>
                            <p className="text-sm text-gray-600">
                              Utilisé le {new Date(usage.usedAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">-{usage.discountAmount.toFixed(2)}€</p>
                            <p className="text-sm text-gray-500">
                              {usage.originalAmount.toFixed(2)}€ → {usage.finalAmount.toFixed(2)}€
                            </p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune utilisation enregistrée</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de création/modification */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCode ? "Modifier le code promo" : "Créer un nouveau code promo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Code promo *</Label>
                <Input
                  id="code"
                  value={newCode.code || ""}
                  onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                  placeholder="BIENVENUE20"
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="type">Type de réduction *</Label>
                <Select value={newCode.type} onValueChange={(value) => setNewCode({ ...newCode, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage</SelectItem>
                    <SelectItem value="fixed">Montant fixe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newCode.description || ""}
                onChange={(e) => setNewCode({ ...newCode, description: e.target.value })}
                placeholder="Description du code promo"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="value">Valeur * {newCode.type === "percentage" ? "(%)" : "(€)"}</Label>
                <Input
                  id="value"
                  type="number"
                  value={newCode.value || ""}
                  onChange={(e) => setNewCode({ ...newCode, value: Number.parseFloat(e.target.value) })}
                  placeholder={newCode.type === "percentage" ? "20" : "10"}
                  min="0"
                  max={newCode.type === "percentage" ? "100" : undefined}
                />
              </div>
              <div>
                <Label htmlFor="maxUses">Utilisations max</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={newCode.maxUses || ""}
                  onChange={(e) => setNewCode({ ...newCode, maxUses: Number.parseInt(e.target.value) })}
                  placeholder="100"
                  min="1"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="isActive"
                  checked={newCode.isActive !== false}
                  onCheckedChange={(checked) => setNewCode({ ...newCode, isActive: checked })}
                />
                <Label htmlFor="isActive">Actif</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validFrom">Valide à partir du</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={newCode.validFrom || ""}
                  onChange={(e) => setNewCode({ ...newCode, validFrom: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="validUntil">Valide jusqu'au</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={newCode.validUntil || ""}
                  onChange={(e) => setNewCode({ ...newCode, validUntil: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Forfaits applicables</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["all", "essentiel", "professionnel", "premium"].map((plan) => (
                  <label key={plan} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newCode.applicablePlans?.includes(plan)}
                      onChange={(e) => {
                        const plans = newCode.applicablePlans || []
                        if (e.target.checked) {
                          setNewCode({ ...newCode, applicablePlans: [...plans, plan] })
                        } else {
                          setNewCode({ ...newCode, applicablePlans: plans.filter((p) => p !== plan) })
                        }
                      }}
                    />
                    <span className="capitalize">{plan === "all" ? "Tous les forfaits" : plan}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={editingCode ? handleUpdateCode : handleCreateCode}>
                {editingCode ? "Modifier" : "Créer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
