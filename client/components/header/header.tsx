"use client"

import { useUserStore } from "@/store/user-store"
import { Button } from "@/components/ui/button"
import { LoginDialog } from "@/components/login/login-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { useLogout } from "@/hooks/auth/use-logout"
import { RegisterDialog } from "@/components/register/register-dialog"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { ROUTES } from "@/constants/routes"

const items = [
  {
    title: "All articles",
    link: ROUTES.HOME,
  },
  {
    title: "My Articles",
    link: ROUTES.MY_ARTICLES,
  },
]

export function Header() {
  const { isAuthenticated, user } = useUserStore()
  const logout = useLogout()

  return (
    <header className="w-full flex justify-between items-center py-2">
      <h1 className="font-bold text-xl">Articles Project</h1>

      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {items.map(({ title, link }) => (
            <NavigationMenuItem key={title}>
              <NavigationMenuLink asChild>
                <Link href={link}>{title}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {user && isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2">
              <Avatar className="text-background rounded-lg">
                <AvatarImage src="" alt="@shadcn" />
                <AvatarFallback className="bg-foreground rounded-lg">
                  {user.firstName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <Label className="leading-4">
                  {user.firstName} {user.lastName}
                </Label>
                <p className="text-sm text-muted-foreground leading-4">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-50" align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <LoginDialog />
          <RegisterDialog />
        </div>
      )}
    </header>
  )
}
