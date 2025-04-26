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
      permissions: ["Lister_Marques"], // Permission required to view "Brands"
    },
    {
      title: "Composants", // "Components"
      url: "#",
      icon: Cpu,
      isActive: false,
      permissions: ["Lister_Composants"], // Permission for "Composants" section
      items: [
        {
          title: "Rams",
          url: "/rams/",
          permissions: ["Lister_Composants"], // Permission for "Rams"
        },
        {
          title: "Disque Dur", // "Hard Drive"
          url: "/hard-drives/",
          permissions: ["Lister_Composants"], // Permission for "Hard Drive"
        },
        {
          title: "Processeur", // "Processor"
          url: "/processors/",
          permissions: ["Lister_Composants"], // Permission for "Processor"
        },
        {
          title: "Alimentations", // "Power Supplies"
          url: "/power-supplies/",
          permissions: ["Lister_Composants"], // Permission for "Power Supplies"
        },
        {
          title: "Cartes Mères", // "Motherboards"
          url: "/motherboards/",
          permissions: ["Lister_Composants"], // Permission for "Motherboards"
        },
        {
          title: "Cartes Réseau", // "Network Cards"
          url: "/network-cards/",
          permissions: ["Lister_Composants"], // Permission for "Network Cards"
        },
        {
          title: "Contrôleurs RAID", // "Raid Controllers"
          url: "/raid-controllers/",
          permissions: ["Lister_Composants"], // Permission for "Raid Controllers"
        },
        {
          title: "Solutions de Refroidissement", // "Cooling Solutions"
          url: "/cooling-solutions/",
          permissions: ["Lister_Composants"], // Permission for "Cooling Solutions"
        },
        {
          title: "Châssis", // "Chassis"
          url: "/chassis/",
          permissions: ["Lister_Composants"], // Permission for "Chassis"
        },
        {
          title: "Cartes Graphiques", // "Graphics Cards"
          url: "/graphic-cards/",
          permissions: ["Lister_Composants"], // Permission for "Graphics Cards"
        },
        {
          title: "Cartes Fibre Optique", // "Fiber Optic Cards"
          url: "/fiber-optic-cards/",
          permissions: ["Lister_Composants"], // Permission for "Fiber Optic Cards"
        },
        {
          title: "Cartes d'Extension", // "Expansion Cards"
          url: "/expansion-cards/",
          permissions: ["Lister_Composants"], // Permission for "Expansion Cards"
        },
        {
          title: "Batteries", 
          url: "/batteries/",
          permissions: ["Lister_Composants"], // Permission for "Batteries"
        },
        {
          title: "Câbles", // "Cables"
          url: "/cable-connectors/",
          permissions: ["Lister_Composants"], // Permission for "Cables"
        },
      ],
    },
    {
      title: "Serveurs", // "Servers"
      url: "/servers/",
      icon: Server,
      permissions: ["Lister_Serveurs"], // Permission for "Servers"
    },
    {
      title: "Réductions", // "Discount"
      url: "#",
      icon: Tag,
      isActive: false,
      permissions: ["Lister_Remises_Serveurs", "Lister_Remises_Composants"], // Permissions for Discounts
      items: [
        {
          title: "Serveurs",
          url: "/discounts/",
          permissions: ["Lister_Remises_Serveurs"], // Permission for "Discounts - Servers"
        },
        {
          title: "Composants", // "Components"
          url: "/discountComponents/",
          permissions: ["Lister_Remises_Composants"], // Permission for "Discounts - Components"
        },
      ],
    },
    {
      title: "Fournisseurs", // "Suppliers"
      url: "/suppliers/",
      icon: Package,
      permissions: ["Lister_Fournisseurs"], // Permission for "Suppliers"
    },
    {
      title: "Stock",
      url: "#",
      icon: Warehouse,
      isActive: false,
      permissions: ["Lister_Mouvements_Stock", "Lister_Niveaux_Stock"], // Permissions for "Stock"
      items: [
        {
          title: "Mouvement", // "Movement"
          url: "/stock-movements/",
          permissions: ["Lister_Mouvements_Stock"], // Permission for "Stock Movements"
        },
        {
          title: "Niveaux", // "Levels"
          url: "/stock-levels/",
          permissions: ["Lister_Niveaux_Stock"], // Permission for "Stock Levels"
        },
      ],
    },
  ],
  projects: [
    {
      permissions: ["Lister_Tableau_de_bord"],
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
      permissions: ["Gerer_Utilisateurs"],
      items: [
        {
          title: "Rôles & Permissions",
          url: "/users/",
          permissions:  ["Gerer_Utilisateurs"], 
        },
        {
          title: "Profil", 
          url: "/profile/",
        },
        {
          title: "Clients Informations",
          url: "/customers/",
          permissions:  ["Gerer_Utilisateurs"], 
        },
        {
          title: "Audits Connexions", 
          url: "/authenticationLogs/",
          permissions:  ["Voir_Audits_Connexion"],
        },
        {
          title: "Audits logs", 
          url: "/auditLogs/",
          permissions:  ["Voir_Logs_Audit"],
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