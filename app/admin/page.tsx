import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminCategoriesManagement from "@/components/admin-categories-management"

export default function AdminPage() {
  return (
    <Tabs defaultValue="categories" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="categories">Catégories</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="categories">
        <AdminCategoriesManagement />
      </TabsContent>
      <TabsContent value="account">Make changes to your account here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  )
}
