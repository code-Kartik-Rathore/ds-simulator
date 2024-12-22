import { AppSidebar } from "@/components/global/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Breadcrumbs />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
