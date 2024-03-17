import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link } from "@remix-run/react";

export default function DashboardNavBar() {
    const [navBarOpen, setNavBarOpen] = useState(false);

    return (
        <header className="p-2 flex items-center justify-between relative shadow-sm">
            <h1 className="text-xl">Tableau de bord</h1>
            <Button className="" onClick={() => setNavBarOpen(!navBarOpen)}><MenuIcon /></Button>
            <nav className={`${navBarOpen ? 'flex' : 'hidden'} z-50 w-full absolute left-0 top-full bg-white`}>
                <ul className="p-2 w-full">
                    <li className="w-full">
                        <Button variant={"ghost"} asChild className="w-full">
                            <Link to={"/dashboard/links"} onClick={() => setNavBarOpen(false)}>Mes Liens</Link>
                        </Button>
                    </li>
                    <li className="w-full">
                        <Button variant={"ghost"} asChild className="w-full">
                            <Link to={"/dashboard/account"} onClick={() => setNavBarOpen(false)}>Mon compte</Link>
                        </Button>
                    </li>
                </ul>
            </nav>
        </header>
    )
}