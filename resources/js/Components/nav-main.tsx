"use client"
import { Link } from '@inertiajs/react';
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
}: {
  items?: { title: string; url: string; items?: any[]; isActive?: boolean }[];
}) {
  return (
    <>
      {items?.map((subItem) => {
        const hasSubItems = subItem.items && subItem.items.length > 0;
        return (
          <SidebarMenuSubItem key={subItem.title}>
            {hasSubItems ? (
              <Collapsible
                defaultOpen={subItem.isActive}
                className="group/collapsible"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center w-full">
                      <SidebarMenuSubButton>
                        <span className="text-xs">{subItem.title}</span>
                      </SidebarMenuSubButton>
                        <ChevronRight className="w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                     
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <RenderSubItems items={subItem.items} />
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link href={subItem.url}>
                  <span className="text-xs">{subItem.title}</span>
               
              </Link>
            )}
          </SidebarMenuSubItem>
        );
      })}
    </>
  );
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
      items?: any[];
    }[];
  }[];
}) {
  if (!items || items.length === 0) return null;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platforme</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          return (
            <SidebarMenuItem key={item.title}>
              {hasSubItems ? (
                <Collapsible
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center w-full">
                      <SidebarMenuButton tooltip={item.title} >
                          {item.icon && <item.icon />}
                          <span className="text-xs">{item.title}</span>
                      </SidebarMenuButton>
                      
                          <ChevronRight className="w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                       
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <RenderSubItems items={item.items} />
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span className="text-xs">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}