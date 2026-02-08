import { Head, Link, useForm, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormEventHandler } from 'react';

// Local route helper until Ziggy global is sorted
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
}

export default function Dashboard({ videos }: { videos: Video[] }) {
    const { data, setData, post, processing, errors } = useForm({
        url: '',
        file: null as File | null,
        model: 'gemini-2.0-flash',
        api_key: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('videos.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-8 p-8">
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>New Analysis</CardTitle>
                        <CardDescription>Analyze a YouTube video or upload a file.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="url">YouTube URL</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={data.url}
                                    onChange={(e) => setData('url', e.target.value)}
                                    disabled={!!data.file}
                                />
                                {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or upload file</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="file">Video File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept="video/mp4,video/quicktime"
                                    onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                    disabled={!!data.url}
                                />
                                {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                            </div>

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
                                        <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended)</SelectItem>
                                        <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash (Latest)</SelectItem>
                                        <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro (High Accuracy)</SelectItem>
                                        <SelectItem value="gemini-3-flash-preview">Gemini 3 Flash (Preview)</SelectItem>
                                        <SelectItem value="gemini-3-pro-preview">Gemini 3 Pro (Preview)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="api_key">Gemini API Key (Optional)</Label>
                                <Input
                                    id="api_key"
                                    type="password"
                                    placeholder="Leave blank to use server default"
                                    value={data.api_key}
                                    onChange={(e) => setData('api_key', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Override the default server key with your own.
                                </p>
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? 'Starting Analysis...' : 'Analyze Video'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="w-full max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4">Recent Processed Videos</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {videos.map((video) => (
                            <div key={video.id} className="relative group">
                                <Link href={route('videos.show', video.id)}>
                                    <Card className="hover:bg-muted/50 transition-colors h-full">
                                        <CardHeader>
                                            <CardTitle className="line-clamp-1 text-base pr-8">{video.title || 'Untitled Video'}</CardTitle>
                                            <CardDescription className="capitalize">Status: {video.status}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-900"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (confirm('Are you sure you want to delete this analysis?')) {
                                            router.delete(route('videos.destroy', video.id));
                                        }
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                        {videos.length === 0 && (
                            <div className="col-span-full text-center text-muted-foreground py-8">
                                No videos analyzed yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
