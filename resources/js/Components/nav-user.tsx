"use client"

import { useForm } from "@inertiajs/react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { LogOut, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function NavUser({
  user, isNavbar, btnClassName
}: Props) {
  const { isMobile } = useSidebar()
  const { post } = useForm(); 

  const handleLogout = () => {
    post(route('logout'));
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn("data-[state=open]:bg-white bg-white rounded-xl data-[state=open]:text-sidebar-accent-foreground", btnClassName)}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/user.png" alt={user.name} />
                <AvatarFallback className="rounded-lg"></AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-black font-semibold">{user.name}</span>
                <span className="truncate text-black text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-black" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl bg-black border-[hsl(0,0%,8%)] hover:bg-white "
            side={isMobile || isNavbar ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {
              !isNavbar && (
                <>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user.name}</span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )
            }
            <DropdownMenuItem asChild>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full hover:text-black items-center gap-2"
              >
                <LogOut className="size-4 " />
                Log out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
