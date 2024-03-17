"use client"

import { useNavigate } from "@remix-run/react";
import { isSignInWithEmailLink } from "firebase/auth";
import { auth } from "~/services/firebase";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useSignInUser } from "~/hooks/useSignIn";
import DashboardNavBar from "~/components/DashboardNavBar";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { authCodeToMessage } from "~/lib/authCodeToMessage";

const formSchema = z.object({
    email: z.string().email({ message: "L'email doit être valide !" }),
    password: z.string().min(6, 'Le mot de passe doit être de 6 caractère minimum !')
});

export default function Login() {
    const navigate = useNavigate();
    const [signInUser, user, isLoading, error] = useSignInWithEmailAndPassword(auth);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const user = await signInUser(values.email, values.password);
        if (user) {
            navigate("/dashboard/account");
        }
    }

    return (
        <>
            <DashboardNavBar />
            <main className="flex flex-col items-center">
                {error ? (
                    <Alert className="w-11/12 my-2" variant={"destructive"}>
                        <AlertCircleIcon />
                        <AlertTitle>Une erreur s'est produite !</AlertTitle>
                        <AlertDescription>{authCodeToMessage(error.code)}</AlertDescription>
                    </Alert>
                ) : null}
                <h2 className="text-3xl font-medium">Connexion</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center space-y-4 w-11/12">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="test@test.org" autoComplete="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Mot de passe</FormLabel>
                                    <FormControl>
                                        <Input type="password" autoComplete="current-password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>{isLoading ? <><Loader2 className="animate-spin mr-2" /> Connexion...</> : 'Se connecter'}</Button>
                    </form>
                </Form>
            </main>
        </>
    )
}