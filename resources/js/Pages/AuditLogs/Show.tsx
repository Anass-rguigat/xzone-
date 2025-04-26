import { useEffect } from 'react';
import { Layout } from '@/Layouts/Layout';
import { usePage, Link } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { UAParser } from 'ua-parser-js';
import { translateModel } from '@/translations';

interface User {
    id: number;
    name: string;
}

interface Auditable {
    id: number;
    name?: string;
    title?: string;
}

interface AuditLog {
    id: number;
    event: string;
    ip_address: string;
    user_agent: string;
    created_at: string;
    old_values: Record<string, any>;
    new_values: Record<string, any>;
    auditable_type: string;
    auditable_id: number;
    user?: User;
    auditable?: Auditable;
}

interface Props {
    log: AuditLog;
}

export default function Show({ log }: Props) {
    const { flash } = usePage().props;
    const { browser, os, device } = new UAParser(log.user_agent).getResult();

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const formatDateTime = (date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR');
    };

    const renderKeyValue = (obj: Record<string, any>) =>
        Object.entries(obj).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm border-b py-1">
                <span className="text-gray-700 font-medium">{key}</span>
                <span className="text-gray-600">{String(value)}</span>
            </div>
        ));

    return (
        <Layout>
            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white rounded-2xl">
                <div className="space-y-1">
                    <h1 className="text-lg font-semibold text-gray-900">Détails du Log d’Audit</h1>
                    <p className="text-xs text-gray-600">Événement #{log.id} enregistré</p>
                </div>

                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Événement</label>
                            <p className="text-gray-900">{log.event}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Date / Heure</label>
                            <p className="text-gray-900">{formatDateTime(log.created_at)}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Utilisateur</label>
                            <p className="text-gray-900">{log.user?.name || 'Système'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Entité concernée</label>
                            <p className="text-gray-900">{translateModel(log.auditable_type)}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Nom de l’entité</label>
                            <p className="text-gray-900">{log.auditable?.name || log.auditable?.title || `#${log.auditable_id}`}</p>
                        </div>

                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Adresse IP</label>
                            <p className="text-mono text-gray-900">{log.ip_address}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Navigateur</label>
                            <p className="text-gray-900">{browser.name} {browser.version}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Système</label>
                            <p className="text-gray-900">{os.name} {os.version}</p>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200" />
                {/*
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Anciennes Valeurs</label>
                        <div className="bg-gray-50 border rounded-md p-3 space-y-1 mt-1">
                            {Object.keys(log.old_values || {}).length
                                ? renderKeyValue(log.old_values)
                                : <span className="text-xs text-gray-500">Aucune</span>}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Nouvelles Valeurs</label>
                        <div className="bg-gray-50 border rounded-md p-3 space-y-1 mt-1">
                            {Object.keys(log.new_values || {}).length
                                ? renderKeyValue(log.new_values)
                                : <span className="text-xs text-gray-500">Aucune</span>}
                        </div>
                    </div>
                </div>
                */}
                {/* Actions */}
                <div className="flex justify-end pt-6">
                    <Link
                        href="/auditLogs"
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        ← Retour à la liste
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
