import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, BarChart3, Video, CheckCircle } from 'lucide-react';

// Use the explicit helpers instead of global route() if Ziggy isn't auto-injected
const route = (name: string, params?: any) => {
    // Basic fallback or use internal Laravel Wayfinder if available
    // For now assuming Ziggy global might be missing, so we use string interpolation for key routes
    // OR we can just use the path strings directly for simplicity in Welcome page
    if (name === 'login') return '/login';
    if (name === 'register') return '/register';
    if (name === 'dashboard') return '/dashboard';
    return '/';
};

export default function Welcome({ auth }: { auth: { user: any } }) {
    return (
        <>
            <Head title="YouTube Content Analyzer" />
            <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
                {/* Navbar */}
                <header className="absolute top-0 w-full z-50">
                    <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                            <Shield className="w-6 h-6 text-primary" />
                            <span>SafeStream AI</span>
                        </div>
                        <nav className="hidden md:flex gap-8 text-sm font-medium">
                            <a href="#features" className="hover:text-primary transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
                            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                        </nav>
                        <div className="flex gap-4">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button>Go to Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button variant="ghost">Log in</Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button>Sign up</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                    <div className="container mx-auto px-6 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border text-sm font-medium mb-8 animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Powered by Google Gemini 1.5 Pro
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Automated Content Safety <br className="hidden md:block" />
                            for <span className="text-primary">Video Platforms</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                            Upload videos or paste YouTube URLs to instantly detect NSFW content, violence, and policy violations with frame-by-frame precision.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href={auth.user ? route('dashboard') : route('register')}>
                                <Button size="lg" className="h-12 px-8 text-lg gap-2">
                                    Start Analyzing Now <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <a href="#how-it-works">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                                    View Demo
                                </Button>
                            </a>
                        </div>

                        {/* Hero Image / Dashboard Preview */}
                        <div className="mt-20 relative rounded-xl border bg-card/50 shadow-2xl p-2 md:p-4 backdrop-blur-sm mx-auto max-w-5xl transform hover:scale-[1.01] transition-transform duration-500">
                            <div className="rounded-lg overflow-hidden border bg-background aspect-video flex items-center justify-center relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10 flex items-end justify-center pb-12">
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Analysis Dashboard Preview</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-12 gap-4 w-full h-full p-8 opacity-40 group-hover:opacity-60 transition-opacity">
                                    {/* Mock UI elements */}
                                    <div className="col-span-3 bg-muted rounded-md h-full"></div>
                                    <div className="col-span-9 flex flex-col gap-4">
                                        <div className="bg-muted rounded-md h-12 w-full"></div>
                                        <div className="bg-muted rounded-md h-64 w-full"></div>
                                        <div className="flex gap-4">
                                            <div className="bg-muted rounded-md h-32 w-1/3"></div>
                                            <div className="bg-muted rounded-md h-32 w-1/3"></div>
                                            <div className="bg-muted rounded-md h-32 w-1/3"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <Video className="w-16 h-16 text-primary opacity-80" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section id="features" className="py-24 bg-secondary/20">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise-Grade Analysis</h2>
                            <p className="text-muted-foreground text-lg">
                                Leveraging the latest multimodal AI models to provide unmatched accuracy in content moderation.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Zap className="w-10 h-10 text-yellow-500" />,
                                    title: "Real-time Processing",
                                    desc: "Process hours of video content in minutes using asynchronous queue workers and optimized chunking."
                                },
                                {
                                    icon: <Shield className="w-10 h-10 text-primary" />,
                                    title: "Comprehensive Safety",
                                    desc: "Detect hate speech, harassment, sexually explicit content, and dangerous acts with high confidence."
                                },
                                {
                                    icon: <BarChart3 className="w-10 h-10 text-blue-500" />,
                                    title: "Granular Reporting",
                                    desc: "Get second-by-second analysis with severity scores and category breakdowns for every violation."
                                }
                            ].map((feature, i) => (
                                <div key={i} className="bg-card border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="mb-4 p-3 bg-background rounded-lg inline-block border shadow-sm">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it Works / Tech Stack */}
                <section id="how-it-works" className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center gap-16">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-bold tracking-tight mb-6">Built on a Robust Stack</h2>
                                <div className="space-y-6">
                                    {[
                                        "Laravel 12 Backend for secure orchestration",
                                        "React Inertia for a seamless SPA experience",
                                        "Python & yt-dlp for advanced media processing",
                                        "Gemini 1.5 Flash/Pro for multimodal reasoning"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                                            <span className="text-lg font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10">
                                    <Link href={route('register')}>
                                        <Button size="lg">Get Started Free</Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="md:w-1/2 bg-muted rounded-2xl p-8 aspect-square flex items-center justify-center relative overflow-hidden">
                                {/* Abstract graphical representation of the process */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5"></div>
                                <div className="relative z-10 grid grid-cols-2 gap-4">
                                    <div className="bg-background p-6 rounded-xl shadow-lg border animate-pulse">
                                        <Video className="w-8 h-8 mb-4 text-foreground" />
                                        <div className="h-2 w-16 bg-muted-foreground/20 rounded mb-2"></div>
                                        <div className="h-2 w-10 bg-muted-foreground/20 rounded"></div>
                                    </div>
                                    <div className="bg-background p-6 rounded-xl shadow-lg border translate-y-8">
                                        <Zap className="w-8 h-8 mb-4 text-yellow-500" />
                                        <div className="h-2 w-16 bg-muted-foreground/20 rounded mb-2"></div>
                                        <div className="h-2 w-10 bg-muted-foreground/20 rounded"></div>
                                    </div>
                                    <div className="bg-background p-6 rounded-xl shadow-lg border -translate-y-4">
                                        <Shield className="w-8 h-8 mb-4 text-green-500" />
                                        <div className="h-2 w-16 bg-muted-foreground/20 rounded mb-2"></div>
                                        <div className="h-2 w-10 bg-muted-foreground/20 rounded"></div>
                                    </div>
                                    <div className="bg-background p-6 rounded-xl shadow-lg border translate-y-4">
                                        <BarChart3 className="w-8 h-8 mb-4 text-blue-500" />
                                        <div className="h-2 w-16 bg-muted-foreground/20 rounded mb-2"></div>
                                        <div className="h-2 w-10 bg-muted-foreground/20 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-muted/50 border-t py-12">
                    <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
                        <p className="mb-4">&copy; {new Date().getFullYear()} SafeStream AI. All rights reserved.</p>
                        <div className="flex justify-center gap-6">
                            <a href="#" className="hover:text-foreground">Privacy Policy</a>
                            <a href="#" className="hover:text-foreground">Terms of Service</a>
                            <a href="#" className="hover:text-foreground">Contact</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
