import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Palette } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
    const categories = ['Abstract', 'Portrait', 'Landscape', 'Digital', 'Surrealism'];
    const aboutLinks = ['About Us', 'Careers', 'Blog', 'Help', 'Sitemap'];
    
    return (
        <footer className="border-t bg-card text-card-foreground">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Categories */}
                    <div className="space-y-4">
                        <h3 className="font-semibold tracking-wider uppercase">Shop by Category</h3>
                        <ul className="space-y-2">
                            {categories.map(category => (
                                <li key={category}>
                                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Artists */}
                    <div className="space-y-4">
                        <h3 className="font-semibold tracking-wider uppercase">For Artists</h3>
                        <ul className="space-y-2">
                            <li><Link href="/upload" className="text-muted-foreground hover:text-primary transition-colors">Sell Your Art</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Artist Handbook</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Community Forum</Link></li>
                        </ul>
                    </div>
                    
                    {/* About Artify */}
                    <div className="space-y-4">
                        <h3 className="font-semibold tracking-wider uppercase">About Artify</h3>
                        <ul className="space-y-2">
                             {aboutLinks.map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal & App Downloads */}
                    <div className="space-y-4 col-span-2 md:col-span-2">
                         <h3 className="font-semibold tracking-wider uppercase">Get the App</h3>
                         <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="outline" className="w-full sm:w-auto justify-start">
                                <img src="https://img.uxwing.com/wp-content/themes/uxwing/download/brands-social-media/google-play-icon.png" alt="Play Store" className="h-6 w-6 mr-2" />
                                <div>
                                    <p className="text-xs">GET IT ON</p>
                                    <p className="text-sm font-semibold">Google Play</p>
                                </div>
                            </Button>
                             <Button variant="outline" className="w-full sm:w-auto justify-start">
                                <img src="https://img.uxwing.com/wp-content/themes/uxwing/download/brands-social-media/apple-icon.png" alt="App Store" className="h-6 w-6 mr-2" />
                                <div>
                                    <p className="text-xs">Download on the</p>
                                    <p className="text-sm font-semibold">App Store</p>
                                </div>
                            </Button>
                         </div>
                         <div className="pt-4">
                            <h3 className="font-semibold tracking-wider uppercase">Legal & Privacy</h3>
                            <ul className="space-y-2 mt-4">
                                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
                                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                                 <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Vulnerability Disclosure</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                     <div className="flex items-center">
                         <Palette className="h-6 w-6 text-primary" />
                         <span className="font-headline ml-2 text-xl font-bold">Artify</span>
                          <p className="ml-4 text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Artify. All rights reserved.
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Youtube /></Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin /></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
