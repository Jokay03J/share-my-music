import { useAuthState } from "react-firebase-hooks/auth"
import { z } from "zod";
import { auth, firestore, storage } from "~/services/firebase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useOutletContext } from "@remix-run/react";
import { User, updateProfile } from "firebase/auth";
import { Toaster } from "~/components/ui/toaster";
import { useToast } from "~/components/ui/use-toast";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const formSchema = z.object({
    avatar: z.instanceof(File).optional(),
    email: z.string().email().optional(),
    displayName: z.string().max(255)
});

export default function Account() {
    const user = useOutletContext<User>()
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            avatar: undefined,
            displayName: user.displayName ?? "",
            email: user.email!
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        if (values.avatar) {
            const toastSended = toast({ title: "Téléversement de l'avatar à commencé" });
            const imageRef = ref(storage, 'avatars/' + user.uid);
            const data = await values.avatar.arrayBuffer();
            const uploadTask = uploadBytesResumable(imageRef, data)
            uploadTask.on('state_changed', (snapshot) => {
                if (snapshot.state === "running") {
                    const pourcentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    toastSended.update({ id: toastSended.id, title: `Téléversement de l'avatar en cours: ${pourcentage}%` })
                }
            }, (err) => { }, async () => {
                const photoURL = await getDownloadURL(uploadTask.snapshot.ref);
                const ref = doc(firestore, 'users', user.displayName!.toLowerCase());
                await setDoc(ref, { photoURL }, { merge: true })
                await updateProfile(user, { photoURL });
                return toastSended.update({ id: toastSended.id, title: "L'avatar à bien été téléverser !" })
            });
        }
        toast({ title: "Le profile à bien été mis à jour" })
    }
    return (
        <>
            <Avatar className="w-[5rem] h-[5rem] my-2">
                <AvatarImage src={user.photoURL!} />
                <AvatarFallback>{user.displayName ? user.displayName.slice(0, 2) : user.email?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-2 flex flex-col items-center space-y-4">
                    <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                                <FormLabel>Avatar</FormLabel>
                                <FormControl>
                                    <Input  {...fieldProps} type="file" accept="image/*" onChange={(event) =>
                                        onChange(event.target.files && event.target.files[0])
                                    } />
                                </FormControl>
                                <FormDescription>
                                    Cette avatar sera afficher lorsque les utilisateurs irons sur vos liens.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Surnom</FormLabel>
                                <FormControl>
                                    <Input maxLength={255} {...field} disabled />
                                </FormControl>
                                <FormDescription>
                                    Le surnom sera afficher lorsque les utilisateurs irons sur vos liens.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} value={user?.email!} disabled />
                                </FormControl>
                                <FormDescription>
                                    Email utiliser pour vous connecter à votre compte.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Envoyer</Button>
                </form>
            </Form>
            <Toaster />
        </>)
}