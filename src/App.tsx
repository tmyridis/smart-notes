import "./App.css";
import { AppSidebar } from "./components/Sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { ModeToggle } from "./components/mode-toggle";
import { NotesProvider } from "./context/notesContext";
import { TasksProvider } from "./context/tasksContext";
import { AuthProvider } from "./context/authContext";
import { Toaster } from "sonner";
function App() {
  return (
    <>
      <SidebarProvider>
        <NotesProvider>
          <TasksProvider>
            <AppSidebar />
            <SidebarInset>
              <div className="flex min-h-screen">
                <Outlet />
                {/* <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header> */}
              </div>
              {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div> */}
              <div className="fixed right-5 top-5">
                <ModeToggle />
              </div>
              <Toaster richColors closeButton position="bottom-center" />
            </SidebarInset>
          </TasksProvider>
        </NotesProvider>
      </SidebarProvider>
    </>
  );
}

export default App;
