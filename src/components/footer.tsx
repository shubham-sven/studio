import { Palette } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-card">
            <div className="container mx-auto flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-center">
                     <Palette className="h-6 w-6 text-primary" />
                     <span className="font-headline ml-2 text-xl font-bold">Artify</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Artify. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
