import { Head, Link, useForm, router } from '@inertiajs/react';
import { Trash2, Upload, Youtube, Play, Film, Clock, Search, Plus, Loader2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormEventHandler, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Local route helper
const route = (name: string, params?: any) => {
    if (name === 'videos.store') return '/videos';
    if (name === 'videos.show') return `/videos/${params}`;
    if (name === 'videos.destroy') return `/videos/${params}`;
    if (name === 'dashboard') return '/dashboard';
    return '/';
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Video {
    id: number;
    title: string;
    status: string;
    created_at: string;
    url: string | null;
}

export default function Dashboard({ videos }: { videos: Video[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        url: '',
        file: null as File | null,
        model: 'gemini-2.0-flash',
        api_key: '',
    });

    const [activeTab, setActiveTab] = useState("youtube");

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('videos.store'), {
            onSuccess: () => reset('url', 'file')
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-8 p-6 md:p-10 max-w-7xl mx-auto w-full">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">Analysis Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Manage your video content safety workflow.</p>
                    </div>
                    <Button onClick={() => document.getElementById('new-analysis-card')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" /> New Analysis
                    </Button>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Create Analysis (4 cols) */}
                    <div className="lg:col-span-4 space-y-6" id="new-analysis-card">
                        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-xl ring-1 ring-white/10 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Play className="w-5 h-5 fill-current" />
                                    </div>
                                    New Analysis
                                </CardTitle>
                                <CardDescription>Start a new safety check.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="youtube" className="w-full" onValueChange={(val) => {
                                    setActiveTab(val);
                                    setData('file', null);
                                    setData('url', '');
                                }}>
                                    <TabsList className="grid w-full grid-cols-2 mb-6">
                                        <TabsTrigger value="youtube" className="flex items-center gap-2"><Youtube className="w-4 h-4" /> YouTube</TabsTrigger>
                                        <TabsTrigger value="file" className="flex items-center gap-2"><Upload className="w-4 h-4" /> Upload</TabsTrigger>
                                    </TabsList>

                                    <form onSubmit={submit} className="space-y-5">
                                        {activeTab === 'youtube' && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <Label htmlFor="url">YouTube URL</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="url"
                                                        type="url"
                                                        placeholder="https://youtube.com/watch?v=..."
                                                        value={data.url}
                                                        onChange={(e) => setData('url', e.target.value)}
                                                        className="pl-10"
                                                    />
                                                    <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                                                </div>
                                                {errors.url && <p className="text-sm text-destructive font-medium">{errors.url}</p>}
                                            </div>
                                        )}

                                        {activeTab === 'file' && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <Label htmlFor="file">Video File</Label>
                                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                                    <input
                                                        type="file"
                                                        id="file"
                                                        accept="video/mp4,video/quicktime"
                                                        onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                                        <span className="text-sm font-medium text-foreground">{data.file ? data.file.name : "Drop video or click to browse"}</span>
                                                        <span className="text-xs text-muted-foreground">MP4, MOV up to 2GB</span>
                                                    </div>
                                                </div>
                                                {errors.file && <p className="text-sm text-destructive font-medium">{errors.file}</p>}
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label htmlFor="model">AI Model</Label>
                                            <Select
                                                value={data.model}
                                                onValueChange={(value) => setData('model', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a model" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="gemini-3.0-flash">Gemini 3.0 Flash (New & Fast)</SelectItem>
                                                    <SelectItem value="gemini-3.0-pro">Gemini 3.0 Pro (New Standard)</SelectItem>
                                                    <SelectItem value="gemini-3.0-deep-think">Gemini 3.0 Deep Think (Advanced Reasoning)</SelectItem>
                                                    <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended)</SelectItem>
                                                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (High Reasoning)</SelectItem>
                                                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Cost Effective)</SelectItem>
                                                    <SelectItem value="gemini-1.5-flash-8b">Gemini 1.5 Flash-8B (Lowest Latency)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label htmlFor="api_key">API Key <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                            </div>
                                            <Input
                                                id="api_key"
                                                type="password"
                                                placeholder="Use server default"
                                                value={data.api_key}
                                                onChange={(e) => setData('api_key', e.target.value)}
                                                className="font-mono text-xs"
                                            />
                                        </div>

                                        <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Starting...
                                                </>
                                            ) : (
                                                <>Start Analysis <Play className="w-4 h-4 ml-2 fill-current" /></>
                                            )}
                                        </Button>
                                    </form>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Recent Videos (8 cols) */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Clock className="w-5 h-5 text-muted-foreground" /> Recent Reports
                            </h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {videos.map((video, i) => (
                                <div key={video.id} className="group relative animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                                    <Link href={route('videos.show', video.id)} className="block h-full">
                                        <Card className="h-full hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-muted/60 hover:border-primary/50 overflow-hidden bg-card/50 backdrop-blur-sm">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className={`p-2 rounded-md ${video.status === 'completed' ? 'bg-green-500/10 text-green-500' : (video.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500')}`}>
                                                        {video.status === 'completed' ? <CheckCircleIcon className="w-4 h-4" /> : (video.status === 'failed' ? <AlertCircleIcon className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />)}
                                                    </div>
                                                    <span className="text-xs font-mono text-muted-foreground">{new Date(video.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <CardTitle className="line-clamp-2 text-base mt-2 leading-tight group-hover:text-primary transition-colors">
                                                    {video.title || 'Untitled Video'}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pb-2">
                                                <p className="text-xs text-muted-foreground line-clamp-1 break-all">
                                                    {video.url || 'Uploaded File'}
                                                </p>
                                            </CardContent>
                                            <CardFooter className="pt-2">
                                                <div className="w-full flex justify-between items-center text-xs font-medium">
                                                    <span className="capitalize px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-white/5">
                                                        {video.status}
                                                    </span>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive h-8 w-8 z-10"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (confirm('Are you sure you want to delete this analysis?')) {
                                                router.delete(route('videos.destroy', video.id));
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            {videos.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-muted/50 rounded-xl bg-muted/20">
                                    <div className="p-4 bg-muted/50 rounded-full mb-4">
                                        <Film className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium">No reports yet</h3>
                                    <p className="text-muted-foreground max-w-sm mt-2">
                                        Create your first video analysis to see safety insights here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
        </svg>
    )
}

function AlertCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
    )
}
