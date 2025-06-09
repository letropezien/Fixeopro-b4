import { Mail, Settings } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminSettings from "@/components/admin-settings"
import AdminEmailAutomation from "@/components/admin-email-automation"

const AdminPage = () => {
  return (
    <div className="container py-10">
      <Tabs defaultValue="settings" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </TabsTrigger>
          <TabsTrigger value="emails">
            <Mail className="h-4 w-4 mr-2" />
            Emails automatiques
          </TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
        <TabsContent value="emails">
          <AdminEmailAutomation />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminPage
