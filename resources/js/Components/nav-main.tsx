"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useState } from "react"

// Composant récursif pour gérer l'affichage des sous-items
function RenderSubItems({
  items,
  isSubItem = false,
}: {
  items?: { title: string; url: string; items?: any[] }[];
  isSubItem?: boolean;
}) {
  const [openItems, setOpenItems] = useState<string[]>([])

  // Fonction pour gérer l'ouverture/fermeture des sous-items
  const toggleSubItem = (title: string) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(title)
        ? prevOpenItems.filter((item) => item !== title)
        : [...prevOpenItems, title]
    )
  }

  return (
    <>
      {items?.map((subItem) => (
        <SidebarMenuSubItem key={subItem.title}>
          <SidebarMenuSubButton
            asChild
            onClick={() => toggleSubItem(subItem.title)} // Ajout de l'événement de clic
          >
            <a href={subItem.url}>
              <span>{subItem.title}</span>
              {subItem.items && subItem.items.length > 0 && (
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              )}
            </a>
          </SidebarMenuSubButton>

          {/* Affichage des sous-items si l'item est ouvert */}
          {subItem.items && subItem.items.length > 0 && openItems.includes(subItem.title) && (
            <Collapsible asChild>
              <SidebarMenuSub>
                <RenderSubItems items={subItem.items} isSubItem={true} />
              </SidebarMenuSub>
            </Collapsible>
          )}
        </SidebarMenuSubItem>
      ))}
    </>
  )
}

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      items?: {
        title: string;
        url: string;
      }[];
    }[]; 
  }[];
}) {
  const [openItems, setOpenItems] = useState<string[]>([])

  // Fonction pour gérer l'ouverture/fermeture des items principaux
  const toggleItem = (title: string) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(title)
        ? prevOpenItems.filter((item) => item !== title)
        : [...prevOpenItems, title]
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} onClick={() => toggleItem(item.title)}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <RenderSubItems items={item.items} />
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
