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

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  permissions?: string[];
  items?: NavItem[];
}

interface RenderSubItemsProps {
  items?: NavItem[];
}

function RenderSubItems({ items }: RenderSubItemsProps) {
  if (!items || items.length === 0) return null;

  return (
    <>
      {items.map((subItem) => {
        const hasSubItems = subItem.items && subItem.items.length > 0;
        
        return (
          <SidebarMenuSubItem key={`${subItem.title}-${subItem.url}`}>
            {hasSubItems ? (
              <Collapsible
                defaultOpen={subItem.isActive}
                className="group/collapsible"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center w-full gap-2">
                    <SidebarMenuSubButton>
                      <span className="text-xs">{subItem.title}</span>
                    </SidebarMenuSubButton>
                    <ChevronRight className="w-4 h-4 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <RenderSubItems items={subItem.items} />
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link href={subItem.url} className="w-full">
                
                  <span className="text-xs">{subItem.title}</span>
                
              </Link>
            )}
          </SidebarMenuSubItem>
        );
      })}
    </>
  );
}

interface NavcCustomerProps {
  items: NavItem[];
}

export function NavcCustomer({ items }: NavcCustomerProps) {
  if (!items || items.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Utilisateurs</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          
          return (
            <SidebarMenuItem key={`${item.title}-${item.url}`}>
              {hasSubItems ? (
                <Collapsible
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center w-full gap-2">
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span className="text-xs">{item.title}</span>
                      </SidebarMenuButton>
                      <ChevronRight className="w-4 h-4 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                  <Link href={item.url} className="flex items-center gap-2">
                    {item.icon && <item.icon className="w-4 h-4" />}
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