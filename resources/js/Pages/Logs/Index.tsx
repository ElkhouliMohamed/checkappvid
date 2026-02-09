import { Head } from '@inertiajs/react';
import { ScrollArea } from '@/Components/UI/ScrollArea';
import { Badge } from '@/Components/UI/Badge';
import AppLayout from '@/Layouts/AppLayout';

interface LogEntry {
    date: string;
    env: string;
    level: string;
    message: string;
    raw?: string;
}

interface Props {
    logs: LogEntry[];
}

const getLogColor = (level: string) => {
    switch (level.toLowerCase()) {
        case 'error':
        case 'critical':
        case 'alert':
        case 'emergency':
            return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
        case 'warning':
            return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
        case 'info':
        case 'notice':
            return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
        case 'debug':
            return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
        default:
            return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
    }
};

export default function LogsIndex({ logs }: Props) {
    const breadcrumbs = [
        {
            title: 'Logs',
            href: '/logs',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Logs" />
            <div className="flex h-full flex-col p-4 w-full">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
                        <p className="text-muted-foreground">
                            View the latest system events and errors from laravel.log
                        </p>
                    </div>
                </div>

                <div className="flex-1 rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <ScrollArea className="h-[calc(100vh-12rem)] w-full">
                        <div className="min-w-full table-auto text-sm">
                            {logs.length === 0 ? (
                                <div className="flex h-40 items-center justify-center text-muted-foreground">
                                    No logs found or log file is empty.
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-muted/50 z-10">
                                        <tr className="border-b text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            <th className="p-3 w-40">Date</th>
                                            <th className="p-3 w-24">Env</th>
                                            <th className="p-3 w-24">Level</th>
                                            <th className="p-3">Message</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {logs.map((log, index) => (
                                            <tr key={index} className="hover:bg-muted/50 transition-colors">
                                                <td className="p-3 whitespace-nowrap font-mono text-xs text-muted-foreground">
                                                    {log.date || '-'}
                                                </td>
                                                <td className="p-3 whitespace-nowrap">
                                                    <span className="font-mono text-xs">{log.env || '-'}</span>
                                                </td>
                                                <td className="p-3 whitespace-nowrap">
                                                    <Badge variant="outline" className={`border-0 ${getLogColor(log.level)}`}>
                                                        {log.level}
                                                    </Badge>
                                                </td>
                                                <td className="p-3 font-mono text-xs break-all">
                                                    {log.message || log.raw}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </AppLayout>
    );
}
