import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Settings } from "lucide-react"
import AdminLegalContent from "@/components/admin-legal-content"
import AdminSiteSettings from "@/components/admin-site-settings"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Administration</h1>

      <Tabs defaultValue="legal" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="legal" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Contenu légal</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="legal">
          <AdminLegalContent />
        </TabsContent>
        <TabsContent value="settings">
          <AdminSiteSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
