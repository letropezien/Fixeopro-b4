import type React from "react"
import AdminLegalContent from "@/components/admin-legal-content"
import { FileText } from "lucide-react"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { siteConfig } from "@/config/site"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sidebarNavItems = [
  {
    title: "Site Settings",
    href: "/admin",
    icon: "settings",
    description: "Manage your site settings.",
  },
]

interface Props {
  children?: React.ReactNode
}

export default function AdminPage({ children }: Props) {
  return (
    <>
      <div className="border-b">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <MainNav items={siteConfig.mainNav} />
          <div className="hidden sm:flex">{children}</div>
        </div>
      </div>
      <div className="container relative pb-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col lg:flex-row">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">
            <Tabs defaultValue="site-settings" className="w-full">
              <TabsList>
                <TabsTrigger value="site-settings" className="flex items-center space-x-2">
                  <Icons.settings className="h-4 w-4" />
                  <span className="hidden lg:inline">Site Settings</span>
                </TabsTrigger>
                <TabsTrigger value="legal-content" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden lg:inline">Contenus Légaux</span>
                </TabsTrigger>
              </TabsList>
              <Separator className="my-4" />
              <TabsContent value="site-settings">Site Settings Content</TabsContent>
              <TabsContent value="legal-content">
                <AdminLegalContent />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
