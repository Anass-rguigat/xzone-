import * as React from "react"
import {
  AudioWaveform,
  Bookmark,
  BookOpen,
  Bot,
  ClipboardList,
  Command,
  Cpu,
  Frame,
  GalleryVerticalEnd,
  Map,
  Package,
  PieChart,
  Server,
  Settings2,
  SquareTerminal,
  Tag,
  Users,
  Warehouse,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { ScrollArea } from "./ui/scroll-area"
import { usePage } from "@inertiajs/react"
import { User } from "@/types"
import { NavcCustomer } from "./nav-customer"

// This is sample data.
const data = {
  
  teams: [
    {
      name: "XZONE ",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    
  ],
  navMain: [
    {
      title: "Marques", // "Brands"
      url: "/brands/",
      icon: Bookmark,
      permissions: ["List_Brands"], // Permission required to view "Brands"
    },
    {
      title: "Composants", // "Components"
      url: "#",
      icon: Cpu,
      isActive: false,
      permissions: ["List_Composants"], // Permission for "Composants" section
      items: [
        {
          title: "Rams",
          url: "/rams/",
          permissions: ["List_Composants"], // Permission for "Rams"
        },
        {
          title: "Disque Dur", // "Hard Drive"
          url: "/hard-drives/",
          permissions: ["List_Composants"], // Permission for "Hard Drive"
        },
        {
          title: "Processeur", // "Processor"
          url: "/processors/",
          permissions: ["List_Composants"], // Permission for "Processor"
        },
        {
          title: "Alimentations", // "Power Supplies"
          url: "/power-supplies/",
          permissions: ["List_Composants"], // Permission for "Power Supplies"
        },
        {
          title: "Cartes Mères", // "Motherboards"
          url: "/motherboards/",
          permissions: ["List_Composants"], // Permission for "Motherboards"
        },
        {
          title: "Cartes Réseau", // "Network Cards"
          url: "/network-cards/",
          permissions: ["List_Composants"], // Permission for "Network Cards"
        },
        {
          title: "Contrôleurs RAID", // "Raid Controllers"
          url: "/raid-controllers/",
          permissions: ["List_Composants"], // Permission for "Raid Controllers"
        },
        {
          title: "Solutions de Refroidissement", // "Cooling Solutions"
          url: "/cooling-solutions/",
          permissions: ["List_Composants"], // Permission for "Cooling Solutions"
        },
        {
          title: "Châssis", // "Chassis"
          url: "/chassis/",
          permissions: ["List_Composants"], // Permission for "Chassis"
        },
        {
          title: "Cartes Graphiques", // "Graphics Cards"
          url: "/graphic-cards/",
          permissions: ["List_Composants"], // Permission for "Graphics Cards"
        },
        {
          title: "Cartes Fibre Optique", // "Fiber Optic Cards"
          url: "/fiber-optic-cards/",
          permissions: ["List_Composants"], // Permission for "Fiber Optic Cards"
        },
        {
          title: "Cartes d'Extension", // "Expansion Cards"
          url: "/expansion-cards/",
          permissions: ["List_Composants"], // Permission for "Expansion Cards"
        },
        {
          title: "Batteries", 
          url: "/batteries/",
          permissions: ["List_Composants"], // Permission for "Batteries"
        },
        {
          title: "Câbles", // "Cables"
          url: "/cable-connectors/",
          permissions: ["List_Composants"], // Permission for "Cables"
        },
      ],
    },
    {
      title: "Serveurs", // "Servers"
      url: "/servers/",
      icon: Server,
      permissions: ["List_Servers"], // Permission for "Servers"
    },
    {
      title: "Réductions", // "Discount"
      url: "#",
      icon: Tag,
      isActive: false,
      permissions: ["List_Discounts_Servers", "List_Discounts_Composants"], // Permissions for Discounts
      items: [
        {
          title: "Serveurs",
          url: "/discounts/",
          permissions: ["List_Discounts_Servers"], // Permission for "Discounts - Servers"
        },
        {
          title: "Composants", // "Components"
          url: "/discountComponents/",
          permissions: ["List_Discounts_Composants"], // Permission for "Discounts - Components"
        },
      ],
    },
    {
      title: "Fournisseurs", // "Suppliers"
      url: "/suppliers/",
      icon: Package,
      permissions: ["List_Suppliers"], // Permission for "Suppliers"
    },
    {
      title: "Stock",
      url: "#",
      icon: Warehouse,
      isActive: false,
      permissions: ["List_Stock_Mouvements", "List_Stock_Mouvements"], // Permissions for "Stock"
      items: [
        {
          title: "Mouvement", // "Movement"
          url: "/stock-movements/",
          permissions: ["List_Stock_Mouvements"], // Permission for "Stock Movements"
        },
        {
          title: "Niveaux", // "Levels"
          url: "/stock-levels/",
          permissions: ["List_Stock_Levels"], // Permission for "Stock Levels"
        },
      ],
    },
  ],
  projects: [
    {
      permissions: ["List_Dashboard"],
      name: "Ventes & Marketing", // "Sales & Marketing"
      url: "/dashboard",
      icon: PieChart,
    },
  ],
  customers: [
    {
      title: "Comptes", 
      url: "#",
      icon: Users,
      isActive: false,
      permissions: ["manage_users"],
      items: [
        {
          title: "Rôles & Permissions",
          url: "/users/",
          permissions:  ["manage_users"], 
        },
        {
          title: "Profil", 
          url: "/profile/",
        },
        {
          title: "Clients Informations",
          url: "/customers/",
          permissions:  ["manage_users"], 
        },
        {
          title: "Audits Connexions", 
          url: "/authenticationLogs/",
          permissions:  ["Affiche_Connexions_Audits"],
        },
        {
          title: "Audits logs", 
          url: "/auditLogs/",
          permissions:  ["Affiche_logs_Audits"],
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { props: pageProps } = usePage()
  const user: User = pageProps.auth.user 
  const { open, setOpen } = useSidebar()
  const [hovered, setHovered] = React.useState(false)

  const handleMouseEnter = () => {
    setHovered(true)
    if (!open) {
      setOpen(true)
    }
  }
  const hasPermission = (requiredPermissions: string[]) => {
    return requiredPermissions.some(perm => user.permissions.includes(perm))
  }

  const filterNavItems = (items: any[]): any[] => {
    return items
      .filter(item => {
        if (!item.permissions) return true
        return hasPermission(item.permissions)
      })
      .map(item => {
        if (item.items) {
          const filteredSubItems = filterNavItems(item.items)
          return filteredSubItems.length > 0 
            ? { ...item, items: filteredSubItems }
            : null
        }
        return item
      })
      .filter(item => item !== null)
  }

  const filteredNavMain = React.useMemo(() => filterNavItems(data.navMain), [user.permissions])
  const filteredProjects = React.useMemo(() => 
    data.projects.filter(project => hasPermission(project.permissions)), 
    [user.permissions])
  const filteredCustomers = React.useMemo(() => filterNavItems(data.customers), [user.permissions])

    return (
      <div 
        onMouseEnter={handleMouseEnter}
        className="h-full"
      >
        <Sidebar collapsible="icon" {...props}>
          <SidebarHeader>
            <TeamSwitcher teams={data.teams} />
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea>
              {filteredProjects.length > 0 && <NavProjects projects={filteredProjects} />}
              {filteredCustomers.length > 0 && <NavcCustomer items={filteredCustomers} />}
              <NavMain items={filteredNavMain} />
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter>
            {user ? <NavUser isNavbar btnClassName="hover:bg-transparent focus-visible:ring-0" user={user} /> : <p>Loading...</p>}
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
      </div>
    )
  }