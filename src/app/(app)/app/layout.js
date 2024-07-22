
"use client"
import * as React from "react"
import Link from "next/link"
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { PersonIcon } from "@radix-ui/react-icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import serveces from "./services/serveces"


export default function RootLayout({children}) {

  const [activemenu, setactivemenu] = React.useState('dashboard')

  const getallData=()=>{
    serveces.AllServices().then(r=>{
      console.log(r)
    }).catch(e=>{
      console.log(e)
    })
  }

    console.log('children',children)
  return (
   
    <div className="grid min-h-screen w-full md:grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr]">
      <div className="hidden border-r bg-white   md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Bhart E-com</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4" style={{fontSize:13}}>
              <Link
              onClick={()=>{setactivemenu('dashboard')}}
                href="./dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${activemenu=='dashboard' ? 'bg-slate-300 text-primary' : ''}`}

              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                            onClick={()=>{setactivemenu('orders')}}

                href="./orders"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${activemenu=='orders' ? 'bg-slate-300 text-primary' : ''}`}
              >
                <ShoppingCart className="h-4 w-4" />
                Orders
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  6
                </Badge>
              </Link>
              <Link
                onClick={()=>{setactivemenu('stock')}}
                href="./stock"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${activemenu=='stock' ? 'bg-slate-300 text-primary' : ''}`}
              >
                <Package className="h-4 w-4" />
                Stock{" "}
              </Link>
              <Link
                onClick={()=>{setactivemenu('customer')}}

                href="./customer"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${activemenu=='customer' ? 'bg-slate-300 text-primary' : ''}`}
              >
                <Users className="h-4 w-4" />
                Customers
              </Link>
              <Link
                onClick={()=>{setactivemenu('supplier')}}
                href="./supplier"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${activemenu=='supplier' ? 'bg-slate-300 text-primary' : ''}`}
              >
                <PersonIcon className="h-4 w-4" />
                Supplier
              </Link>
              <Link
                onClick={()=>{setactivemenu('reports')}}

                href="report"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${activemenu=='reports' ? 'bg-slate-300 text-primary' : ''}`}
              >
                <LineChart className="h-4 w-4" />
                Report
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            {/* <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription  className="text-xs">
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card> */}



            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Refresh Tally Data</CardTitle>
                <CardDescription  className="text-xs">
                  Refresh Data from tally.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">


                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button size="sm" className="w-full" >
                      Refresh Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                       You wants to delete all data from tally.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={()=>{getallData()}} >Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>



            




          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Bhart Ecom</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Stocks
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
              <div className="mt-auto">
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card> */}



                <Card>
                  <CardHeader>
                    <CardTitle>Delete All Data</CardTitle>
                    <CardDescription>
                      Delete all data in local and resync from tally
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Refresh Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search Something..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-4">
{children}
          </main>
          </div>
          </div>
  )
}
