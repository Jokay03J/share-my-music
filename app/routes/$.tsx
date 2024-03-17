import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export default function NotFound() {
    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <h1 className="mb-4 text-4xl">Page introuvable</h1>
            <Button asChild><Link to={"/"}>Accueil</Link></Button>
        </div>
    )
}