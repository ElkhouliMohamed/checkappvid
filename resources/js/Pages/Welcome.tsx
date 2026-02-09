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
                <title>Checkvid - AI Powered Content Safety</title>
                <meta name="description" content="Checkvid uses Gemini 1.5 Pro to analyze video content for safety, compliance, and brand suitability." />
            </Head>
            <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans overflow-x-hidden relative">

                {/* Background Ambient Gradients */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px] animate-blob"></div>
                    <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                </div>

                {/* Navbar */}
                <header className="fixed top-4 left-4 right-4 z-50 transition-all duration-300">
                    <div className="glass-card container mx-auto px-6 h-16 flex justify-between items-center rounded-2xl border border-white/10 shadow-lg shadow-black/5">
                        <div className="flex items-center gap-3 font-bold text-xl tracking-tighter">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full"></div>
                                <Shield className="relative w-6 h-6 text-primary fill-primary/10" />
                            </div>
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">Checkvid</span>
                        </div>
                        <nav className="hidden md:flex gap-8 text-sm font-medium items-center text-muted-foreground">
                            <a href="#features" className="hover:text-primary transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
                            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                        </nav>
                        <div className="flex gap-4 items-center">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button size="sm" className="rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all">Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button variant="ghost" size="sm" className="rounded-full hover:bg-white/10 text-foreground">Log in</Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button size="sm" className="rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all border border-white/10">Sign up</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 z-10">
                    <div className="container mx-auto px-6 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium mb-8 animate-fade-in-up border border-primary/20 text-primary-foreground/90">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="font-semibold text-white">Gemini 1.5 Pro</span> Intelligence
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] drop-shadow-sm">
                            Video Safety, <br className="hidden md:block" />
                            <span className="text-gradient drop-shadow-lg">Perfected.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                            The enterprise standard for AI-powered content moderation. Detect violations instantly with frame-by-frame precision.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-5 mb-24">
                            <Link href={auth.user ? route('dashboard') : route('register')}>
                                <Button size="lg" className="h-14 px-8 text-lg rounded-full gap-2 shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:scale-105 transition-all duration-300 bg-primary hover:bg-primary/90 text-white border-t border-white/20">
                                    Analyze Video <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <a href="#how-it-works">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full glass border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white">
                                    <Play className="w-4 h-4 mr-2 fill-current" /> Live Demo
                                </Button>
                            </a>
                        </div>

                        {/* Interactive Glass Card Preview */}
                        <div className="relative max-w-5xl mx-auto">
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full"></div>
                            <div className="glass-card rounded-2xl p-2 border border-white/10">
                                <div className="rounded-xl overflow-hidden bg-black/80 aspect-video md:aspect-21/9 relative shadow-2xl ring-1 ring-white/10">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

                                    {/* Abstract UI Elements */}
                                    <div className="absolute top-6 left-6 right-6 flex justify-between items-center opacity-70">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                        </div>
                                        <div className="h-2 w-32 bg-white/10 rounded-full"></div>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center space-y-4">
                                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto backdrop-blur-md border border-white/10 animate-pulse">
                                                <Shield className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-2 w-48 bg-white/10 rounded-full mx-auto"></div>
                                                <div className="h-2 w-32 bg-white/10 rounded-full mx-auto"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Scanline */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-50"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 relative z-10">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: Zap, color: "text-amber-400", title: "Real-time Analysis", desc: "Pipelines capable of processing hours of footage in minutes." },
                                { icon: Shield, color: "text-emerald-400", title: "Safety First", desc: "Detects nudity, violence, hate speech, and dangerous content." },
                                { icon: BarChart3, color: "text-indigo-400", title: "Granular Reports", desc: "Detailed timestamps and confidence scores for every detection." }
                            ].map((item, i) => (
                                <div key={i} className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-500 group">
                                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-primary/30 transition-colors`}>
                                        <item.icon className={`w-7 h-7 ${item.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                                    <p className="text-muted-foreground/80 leading-relaxed font-light">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-lg py-12">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 font-bold text-white">
                            <Shield className="w-5 h-5 text-primary" /> Checkvid
                        </div>
                        <p>&copy; {new Date().getFullYear()} Checkvid AI. Enterprise Safety.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
