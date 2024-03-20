import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
    linkTitle: z.string().max(255),
    fields: z.array(z.object({})),
    newLink: z.string(),
});

export default function NewLink() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            linkTitle: "",
            newLink: "",
        },
    });
    return (
        <>
            <h1 className="text-3xl">Nouveau lien</h1>
            <Form {...form}>
                <FormField
                    control={form.control}
                    name="linkTitle"
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
            </Form>
        </>
    )
}