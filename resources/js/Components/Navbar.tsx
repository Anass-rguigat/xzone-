

import React from "react"
import { usePage } from "@inertiajs/react"
import { SidebarTrigger } from "./ui/sidebar"
import { NavUser } from "./nav-user"
import { User } from "@/types"

export const Navbar = () => {
  const { props } = usePage() 
  const user: User = props.auth.user 

  return (
<header className="z-10 bg-gray-50 top-0 flex items-center gap-2 border-b h-14 px-3 w-full">

      <SidebarTrigger />
    </header>
  )
}
