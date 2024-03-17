import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { auth } from "~/services/firebase";
import { useAuthState, useSendSignInLinkToEmail } from "react-firebase-hooks/auth";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { MenuIcon } from "lucide-react"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [user, loading, error] = useAuthState(auth)
  const [menuActive, setMenuActive] = useState(false);
  const [sendSignInLinkToEmail, sending, errorEmailLink] = useSendSignInLinkToEmail(auth);

  return (
    <>
      <header className="p-2 flex items-center justify-between relative">
        <h1 className="text-xl">Share My Music</h1>
        <Button variant={"ghost"} className="sm:hidden" onClick={() => {
          setMenuActive(!menuActive);
        }}>
          <MenuIcon />
        </Button>
        <nav className={`${menuActive ? "block" : "hidden"} w-full absolute top-full left-0 bg-white shadow-md sm:block sm:shadow-none sm:static sm:w-fit`}>
          <ul className="flex flex-col gap-1 w-full mb-2 sm:flex-row sm:w-fit sm:mb-0">
            <li className="flex justify-center">
              <Button variant={"ghost"} asChild className="w-11/12 justify-start sm:justify-center sm:w-fit">
                <Link to={"#functionality"}>Fonctionnalité</Link>
              </Button>
            </li>
            <li className="flex justify-center">
              <Button variant={"ghost"} asChild className="w-11/12 justify-start sm:justify-center sm:w-fit">
                <Link to={"#pricing"}>Prix</Link>
              </Button>
            </li>
            <li className="flex justify-center">
              <Button variant={"ghost"} asChild className="w-11/12 justify-start sm:justify-center sm:w-fit">
                <Link to={"#pricing"}>Prix</Link>
              </Button>
            </li>
            {user && !loading && (<li className="flex justify-center">
              <Button className="w-11/12 sm:w-fit" asChild><Link to={"/dashboard"}>Dashboard</Link></Button>
            </li>)}
          </ul>
        </nav>
      </header>
      <main className="flex flex-col items-center">
        <h2 className="text-3xl text-center">Gratuit pour <span className="underline">toujours</span></h2>
        <p className="text-center pt-2">Crée un lien pour votre album, ep, ou même podcast facilement !</p>
        <section className="w-full p-2">
          <h3 className="w-full text-3xl">Fonctionnalité</h3>
          <Card >
            <CardHeader><h4>Engager vos utilisateur</h4></CardHeader>
            <CardContent>Partager votre projet sur n'importe quel platforme.</CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
