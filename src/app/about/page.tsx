import { Palette, Users, Award, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-16 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 p-8 shadow-xl">
          <h1 className="font-headline text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">About Artify</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Artify is a premier online art gallery connecting talented artists with art enthusiasts worldwide.
            We believe art should be accessible, discoverable, and appreciated by everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <Palette className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-purple-800 dark:text-purple-200">Diverse Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                From abstract masterpieces to digital art, explore a wide range of artistic expressions.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-purple-800 dark:text-purple-200">Talented Artists</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discover emerging and established artists from around the globe, each with their unique voice.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-purple-800 dark:text-purple-200">Quality Assured</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Every artwork in our collection meets our high standards of authenticity and craftsmanship.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-purple-800 dark:text-purple-200">Global Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Join a worldwide community of art lovers, collectors, and creators sharing their passion.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-2xl p-8 mb-16 border border-purple-200 dark:border-purple-800 shadow-xl">
          <h2 className="font-headline text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Our Mission</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              At Artify, we strive to democratize art by making it accessible to everyone. We provide a platform
              where artists can showcase their work, connect with collectors, and build their careers, while
              art enthusiasts can discover and acquire pieces that speak to their soul.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Through innovative technology and a commitment to excellence, we're building bridges between
              creators and appreciators, fostering a vibrant global art community that celebrates diversity,
              creativity, and the transformative power of art.
            </p>
          </div>
        </div>

        <div className="text-center bg-white/50 dark:bg-gray-900/50 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 p-8 shadow-xl">
          <h2 className="font-headline text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Join Our Community</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're an artist looking to share your work or an art lover seeking your next masterpiece,
            Artify welcomes you to our growing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg h-10 px-8 py-2"
            >
              Start Your Journey
            </a>
            <a
              href="/search"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-purple-300 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80 hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-800 dark:hover:text-purple-200 h-10 px-8 py-2 backdrop-blur-sm"
            >
              Explore Artworks
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
