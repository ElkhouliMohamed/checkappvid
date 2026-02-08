import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';

// Local route helper until Ziggy global is sorted
const route = (name: string, params?: any) => {
    if (name === 'dashboard') return '/dashboard';
    if (name === 'videos.show') return `/videos/${params}`;
    return '/';
};

interface Flag {
    timestamp: string;
    category: string;
    severity: string;
    description: string;
}

interface Report {
    safety_score: number;
    summary: string;
    flags: Flag[];
    error?: string;
    output?: string;
}

interface Video {
    id: number;
    title: string;
    url: string | null;
    status: string;
    report_json: Report | null;
    created_at: string;
}

export default function Show({ video }: { video: Video }) {

    useEffect(() => {
        if (video.status === 'processing' || video.status === 'pending') {
            const interval = setInterval(() => {
                router.reload({ only: ['video'] });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [video.status]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: route('dashboard') },
            { title: 'Analysis Result', href: '' }
        ]}>
            <Head title={`Analysis: ${video.title}`} />

            <div className="flex flex-1 flex-col gap-8 p-8 max-w-5xl mx-auto text-foreground">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{video.title}</h1>
                        <p className="text-muted-foreground">{video.url || 'Uploaded File'}</p>
                    </div>
                    <Badge variant={video.status === 'completed' ? 'default' : (video.status === 'failed' ? 'destructive' : 'secondary')} className="text-lg capitalize">
                        {video.status}
                    </Badge>
                </div>

                {video.status === 'processing' && (
                    <Card>
                        <CardContent className="py-10 text-center">
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                                <div className="text-lg font-medium">Analyzing video content...</div>
                                <p className="text-sm text-muted-foreground">This may take a few minutes depending on video length.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {video.status === 'failed' && (
                    <Card className="border-red-500">
                        <CardHeader>
                            <CardTitle className="text-red-500">Analysis Failed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium text-red-600 mb-2">{video.report_json?.error || 'An unknown error occurred during processing.'}</p>
                            {video.report_json?.output && (
                                <ScrollArea className="h-32 w-full rounded-md border bg-muted p-4">
                                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                                        {video.report_json.output}
                                    </pre>
                                </ScrollArea>
                            )}
                        </CardContent>
                    </Card>
                )}

                {video.status === 'completed' && video.report_json && (
                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Safety Score</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-6xl font-bold ${getScoreColor(video.report_json.safety_score)}`}>
                                        {video.report_json.safety_score}
                                        <span className="text-xl text-muted-foreground ml-2">/ 100</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="leading-relaxed">{video.report_json.summary}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Content Flags</CardTitle>
                                <CardDescription>Detailed timeline of detected concerns.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {video.report_json.flags && video.report_json.flags.length > 0 ? (
                                    <div className="space-y-4">
                                        {video.report_json.flags.map((flag, index) => (
                                            <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border">
                                                <div className="font-mono font-bold w-20 shrink-0">{flag.timestamp}</div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">{flag.category}</span>
                                                        <Badge variant="outline">{flag.severity}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{flag.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-green-500 font-medium">
                                        No safety flags detected.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
