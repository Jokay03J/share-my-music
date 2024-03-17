import { Link, Outlet, useNavigate } from "@remix-run/react";
import { z } from "zod"
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth"
import { auth, firestore } from "~/services/firebase";
import { Button } from "~/components/ui/button";
import DashboardNavBar from "~/components/DashboardNavBar";
import { Skeleton } from "~/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { authCodeToMessage } from "~/lib/authCodeToMessage";


const formSchema = z.object({ username: z.string().max(255) });

export default function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const [updateProfile, loadingUpdateProfile, errorLoadingProfile] = useUpdateProfile(auth);
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: ""
        },
    })

    async function onSubmitUsername(values: z.infer<typeof formSchema>) {
        const ref = doc(firestore, 'users', values.username.toLowerCase());
        const docResult = await getDoc(ref);
        if (docResult.exists()) return form.setError('username', { message: 'Le surnom est déjà pris !' });
        await setDoc(ref, {});
        await updateProfile({ displayName: values.username });
        navigate('/dashboard/account');
    }

    // handle user loading
    if (loading) {
        return (
            <>
                <DashboardNavBar />
                <main className="flex flex-col items-center py-2">
                    <Skeleton className="w-[5rem] h-[5rem] rounded-full" />
                    <Skeleton className="w-10/12 h-[5rem] my-2" />
                    <Skeleton className="w-10/12 h-[5rem] my-2" />
                    <Skeleton className="w-5/12 h-[2rem] my-2" />
                </main>
            </>
        )
    }

    // check if user is connected
    if (!user && !loading) {
        return (
            <>
                <DashboardNavBar />
                <Button asChild><Link to={'auth/login'}>Se connecter</Link></Button>
            </>
        )
    }

    // onboarding
    if (user && !user.displayName) {
        return (
            <>
                <DashboardNavBar />
                <main className="flex flex-col items-center">
                    {errorLoadingProfile ? (
                        <Alert className="w-11/12 my-2" variant={"destructive"}>
                            <AlertCircleIcon />
                            <AlertTitle>Une erreur s'est produite !</AlertTitle>
                            <AlertDescription>{authCodeToMessage(errorLoadingProfile.message)}</AlertDescription>
                        </Alert>
                    ) : null}
                    <h2 className="text-3xl">Bienvenue</h2>
                    <p className="text-center">Afin de pouvoir vous créer des liens facilement partageable et unique, nous avons besoin d'un surnom.</p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitUsername)} className="flex flex-col items-center space-y-4 w-11/12">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Surnom</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Entrer votre surnom" autoComplete="email" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Vous ne pourrez pas le changer par la suite. Surnom qui sera dans vos lien partageable.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={loadingUpdateProfile}>{loadingUpdateProfile ? <><Loader2 className="animate-spin mr-2" /> Modification...</> : 'Modifier'}</Button>
                        </form>
                    </Form>
                </main>
            </>
        )
    }

    return (
        <>
            <DashboardNavBar />
            <main className="flex flex-col items-center">
                <Outlet context={user} />
            </main>
        </>
    )
}