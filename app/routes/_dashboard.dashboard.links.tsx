import { Link, useOutletContext } from "@remix-run/react";
import { User } from "firebase/auth";
import { deleteDoc, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { firestore } from "~/services/firebase";
import { AlertCircleIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function DashboardLinks() {
    const user = useOutletContext<User>();
    const [queryDocs, isLoading, error] = useCollection(collection(firestore, 'users', user.displayName?.toLowerCase()!, 'links'));

    if (error) {
        return (
            <div className="flex flex-col items-center my-2">
                <Alert variant="destructive" className="w-11/12">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        Une erreur est survenue lors de la récupération de vos liens.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    if (isLoading) {
        return (
            <>
                <div className="flex flex-col items-center py-2 w-full">
                    <Skeleton className="w-4/12 h-[2.5rem]" />
                    <Skeleton className="w-10/12 h-[3rem] my-2" />
                    <Skeleton className="w-10/12 h-[3rem] my-2" />
                    <Skeleton className="w-10/12 h-[3rem] my-2" />
                    <Skeleton className="w-10/12 h-[3rem] my-2" />
                </div>
            </>
        )
    }

    return (
        <>
            <Button asChild className="my-2">
                <Link to={"/dashboard/links/new"}>Crée un lien</Link>
            </Button>
            {queryDocs?.docs.map((link) => {
                const data = link.data();

                return (
                    <Card key={link.id}>
                        <CardHeader>{data.title}</CardHeader>
                        <CardContent className="flex gap-1">
                            <Button asChild variant={"secondary"}>
                                <Link to={'/dashboard/links/' + link.id}>Modifier</Link>
                            </Button>
                            <Button variant={"destructive"} onClick={async () => {
                                await deleteDoc(link.ref);
                            }}>
                                Supprimer
                            </Button>
                        </CardContent>
                    </Card>
                );
            })}
        </>
    );
}