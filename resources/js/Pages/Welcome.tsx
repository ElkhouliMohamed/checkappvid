import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/UI/Button';
import { ArrowRight, Shield, Zap, BarChart3, Video, CheckCircle, Play, Server, Lock } from 'lucide-react';

// Use the explicit helpers instead of global route() if Ziggy isn't auto-injected
const route = (name: string, params?: any) => {
    if (name === 'login') return '/login';
    if (name === 'register') return '/register';
    if (name === 'dashboard') return '/dashboard';
    return '/';
};

export default function Welcome({ auth }: { auth: { user: any } }) {
    return (
        <>
            <Head>
                <title>Checkvid - AI Powered YouTube Content Safety Analysis</title>
                <meta name="description" content="Checkvid uses Gemini 1.5 Pro to analyze YouTube videos for safety, moderation, and compliance. Get frame-by-frame timestamps and detailed reports instantly." />
                <meta name="keywords" content="YouTube analysis, content moderation, AI video safety, Gemini AI, video moderation, brand safety" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://checkvid.app/" />
                <meta property="og:title" content="Checkvid - AI Powered Content Safety" />
                <meta property="og:description" content="Analyze YouTube videos for safety and compliance with the power of Gemini 1.5 Pro." />
                <meta property="og:image" content="https://checkvid.app/og-image.jpg" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://checkvid.app/" />
                <meta property="twitter:title" content="Checkvid - AI Powered Content Safety" />
                <meta property="twitter:description" content="Analyze YouTube videos for safety and compliance with the power of Gemini 1.5 Pro." />
                <meta property="twitter:image" content="https://checkvid.app/twitter-image.jpg" />
            </Head>
            <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans overflow-x-hidden">

                {/* Navbar */}
                <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-background/80 backdrop-blur-md border-b border-white/10 supports-backdrop-filter:bg-background/60">
                    <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                        <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">Checkvid</span>
                        </div>
                        <nav className="hidden md:flex gap-8 text-sm font-medium items-center">
                            <a href="#features" className="hover:text-primary transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
                            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                        </nav>
                        <div className="flex gap-4 items-center">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">Go to Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button variant="ghost" className="rounded-full hover:bg-white/5">Log in</Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">Sign up</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
                    <div className="absolute top-1/3 -right-64 w-[500px] h-[500px] bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>

                    <div className="container mx-auto px-6 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-white/10 backdrop-blur-sm text-sm font-medium mb-8 animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">Gemini 1.5 Pro</span> Powered Analysis
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
                            Content Safety <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-purple-500 to-blue-500">Reimagined</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                            Instantly analyze videos for safety violations using advanced multimodal AI.
                            <br className="hidden md:block" />
                            Secure, accurate, and frame-perfect results.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
                            <Link href={auth.user ? route('dashboard') : route('register')}>
                                <Button size="lg" className="h-14 px-8 text-lg rounded-full gap-2 shadow-xl shadow-primary/25 hover:shadow-primary/50 hover:scale-105 transition-all duration-300">
                                    Start Free Analysis <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <a href="#how-it-works">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full backdrop-blur-sm bg-background/30 border-white/10 hover:bg-background/50 hover:border-white/20 transition-all">
                                    <Play className="w-4 h-4 mr-2 fill-current" /> Watch Demo
                                </Button>
                            </a>
                        </div>

                        {/* Hero Image / Dashboard Preview */}
                        <div className="relative rounded-2xl border border-white/10 bg-card/30 shadow-2xl p-2 md:p-3 backdrop-blur-xl mx-auto max-w-6xl transform hover:scale-[1.01] transition-transform duration-700 hover:shadow-primary/10 group">
                            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="rounded-xl overflow-hidden border border-white/5 bg-background aspect-video md:aspect-21/9 flex items-center justify-center relative shadow-inner">
                                <div className="absolute inset-0 bg-size-[32px_32px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>
                                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10"></div>

                                {/* Abstract UI Preview - keeping it abstract but polished */}
                                <div className="grid grid-cols-12 gap-6 w-full h-full p-8 md:p-12 opacity-80">
                                    <div className="col-span-12 md:col-span-3 space-y-4">
                                        <div className="h-full rounded-xl bg-muted/40 border border-white/5 animate-pulse"></div>
                                    </div>
                                    <div className="col-span-12 md:col-span-9 flex flex-col gap-6">
                                        <div className="flex gap-4">
                                            <div className="h-32 w-1/3 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20"></div>
                                            <div className="h-32 w-1/3 rounded-xl bg-muted/40 border border-white/5"></div>
                                            <div className="h-32 w-1/3 rounded-xl bg-muted/40 border border-white/5"></div>
                                        </div>
                                        <div className="flex-1 rounded-xl bg-muted/30 border border-white/5 relative overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-64 h-2 bg-muted/50 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary w-2/3 animate-[shimmer_2s_infinite]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section id="features" className="py-32 relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50">Enterprise-Grade Power</h2>
                            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                                Built for scale, security, and precision. Our platform handles the complexity of content moderation so you don't have to.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Zap className="w-8 h-8 text-yellow-500" />,
                                    title: "Lightning Fast",
                                    desc: "Asynchronous processing pipeline ensures your videos are analyzed in parallel without blocking."
                                },
                                {
                                    icon: <Shield className="w-8 h-8 text-primary" />,
                                    title: "99.9% Accuracy",
                                    desc: "Leveraging Gemini's vast knowledge base to detect subtle nuances in hate speech and violence."
                                },
                                {
                                    icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
                                    title: "Deep Insights",
                                    desc: "Frame-by-frame timestamps allow you to pinpoint exactly where violations occur."
                                }
                            ].map((feature, i) => (
                                <div key={i} className="group relative p-8 rounded-2xl bg-linear-to-b from-card/50 to-card/10 border border-white/10 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                                    <div className="mb-6 p-4 bg-background/50 rounded-xl inline-block border border-white/5 shadow-sm group-hover:bg-primary/10 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it Works / Tech Stack */}
                <section id="how-it-works" className="py-32 bg-secondary/20 relative overflow-hidden">
                    {/* Decorative background grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                            <div className="lg:w-1/2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                                    Tech Stack
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Modern Architecture for Modern Problems</h2>
                                <div className="space-y-8">
                                    {[
                                        { icon: Server, title: "Laravel 12 Backend", desc: "Secure orchestration and API management." },
                                        { icon: Zap, title: "React Inertia", desc: "Seamless SPA experience with server-side routing." },
                                        { icon: Video, title: "Python & yt-dlp", desc: "Advanced media processing and chunking." },
                                        { icon: Lock, title: "Gemini 1.5 Pro", desc: "State-of-the-art multimodal reasoning." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-5 group">
                                            <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-full bg-background border border-white/10 flex items-center justify-center shadow-sm group-hover:border-primary/50 group-hover:text-primary transition-all">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{item.title}</h4>
                                                <p className="text-muted-foreground">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12">
                                    <Link href={route('register')}>
                                        <Button size="lg" className="h-12 px-8 rounded-full text-base">
                                            Build Your First Report Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="lg:w-1/2 w-full">
                                <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-background/50 backdrop-blur-3xl p-8 flex items-center justify-center group">
                                    <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-blue-500/20 opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>

                                    {/* Central abstract graphic */}
                                    <div className="relative z-10 w-full max-w-md aspect-square">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary rounded-full blur-[80px] opacity-40 animate-pulse"></div>

                                        <div className="grid grid-cols-2 gap-4 h-full">
                                            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col justify-between transform transition-transform hover:-translate-y-2 duration-300">
                                                <Video className="w-8 h-8 text-primary mb-4" />
                                                <div className="space-y-2">
                                                    <div className="h-2 w-12 bg-muted rounded-full"></div>
                                                    <div className="h-2 w-20 bg-muted rounded-full"></div>
                                                </div>
                                            </div>
                                            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col justify-between transform transition-transform hover:translate-y-2 duration-300 mt-8">
                                                <Server className="w-8 h-8 text-blue-500 mb-4" />
                                                <div className="space-y-2">
                                                    <div className="h-2 w-12 bg-muted rounded-full"></div>
                                                    <div className="h-2 w-20 bg-muted rounded-full"></div>
                                                </div>
                                            </div>
                                            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col justify-between transform transition-transform hover:translate-y-2 duration-300 -mt-8">
                                                <Lock className="w-8 h-8 text-green-500 mb-4" />
                                                <div className="space-y-2">
                                                    <div className="h-2 w-12 bg-muted rounded-full"></div>
                                                    <div className="h-2 w-20 bg-muted rounded-full"></div>
                                                </div>
                                            </div>
                                            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col justify-between transform transition-transform hover:-translate-y-2 duration-300">
                                                <BarChart3 className="w-8 h-8 text-purple-500 mb-4" />
                                                <div className="space-y-2">
                                                    <div className="h-2 w-12 bg-muted rounded-full"></div>
                                                    <div className="h-2 w-20 bg-muted rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-card border-t border-white/10 py-16">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-4 gap-12 mb-12">
                            <div className="col-span-2">
                                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter mb-6">
                                    <Shield className="w-6 h-6 text-primary" />
                                    <span>Checkvid</span>
                                </div>
                                <p className="text-muted-foreground pr-12">
                                    Empowering platforms with intelligent content safety tools. Built for accuracy, speed, and privacy.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-6">Product</h4>
                                <ul className="space-y-4 text-sm text-muted-foreground">
                                    <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold mb-6">Company</h4>
                                <ul className="space-y-4 text-sm text-muted-foreground">
                                    <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                            <p>&copy; {new Date().getFullYear()} Checkvid. All rights reserved.</p>
                            <div className="flex gap-8">
                                <a href="#" className="hover:text-foreground">Privacy Policy</a>
                                <a href="#" className="hover:text-foreground">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
