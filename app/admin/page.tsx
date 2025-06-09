import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Settings } from "lucide-react"
import AdminLegalContent from "@/components/admin-legal-content"
import AdminSiteSettings from "@/components/admin-site-settings"
import { Overview } from "@/components/admin/overview"
import { Requests } from "@/components/admin/requests"
import { Users } from "@/components/admin/users"
import { Categories } from "@/components/admin/categories"
import { CategoryImages } from "@/components/admin/category-images"
import { PromoCodes } from "@/components/admin/promo-codes"
import { EmailConfig } from "@/components/admin/email-config"
import { PaymentGatewayConfig } from "@/components/admin/payment-gateway-config"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Administration</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="category-images">Category Images</TabsTrigger>
          <TabsTrigger value="promo-codes">Promo Codes</TabsTrigger>
          <TabsTrigger value="email-config">Email Config</TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Contenu légal</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview />
        </TabsContent>
        <TabsContent value="requests">
          <Requests />
        </TabsContent>
        <TabsContent value="users">
          <Users />
        </TabsContent>
        <TabsContent value="categories">
          <Categories />
        </TabsContent>
        <TabsContent value="category-images">
          <CategoryImages />
        </TabsContent>
        <TabsContent value="promo-codes">
          <PromoCodes />
        </TabsContent>
        <TabsContent value="email-config">
          <EmailConfig />
        </TabsContent>
        <TabsContent value="legal">
          <AdminLegalContent />
        </TabsContent>
        <TabsContent value="settings">
          <div className="space-y-6">
            {/* Paramètres du site */}
            <AdminSiteSettings />

            {/* Configuration des paiements */}
            <PaymentGatewayConfig />

            {/* Autres paramètres existants... */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
