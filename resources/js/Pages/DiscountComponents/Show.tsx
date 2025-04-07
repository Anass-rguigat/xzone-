import React from "react";
import { Link } from "@inertiajs/inertia-react";
import { Layout } from "@/Layouts/layout";
import { ArrowLeft, Info, Percent, Clock, Tag } from "lucide-react";

const DiscountShow: React.FC<Props> = ({ discount, components }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-MA", {
            style: "currency",
            currency: "MAD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const getStatus = () => {
        const now = new Date();
        const start = new Date(discount.start_date);
        const end = new Date(discount.end_date);
        if (now < start) return "Programmée";
        if (now > end) return "Expirée";
        return "Active";
    };

    const status = getStatus();
    const statusColors = {
        Active: "bg-green-100 text-green-800",
        Expirée: "bg-red-100 text-red-800",
        Programmée: "bg-blue-100 text-blue-800"
    };

    return (
        <Layout>
            <div className="mx-auto max-w-full p-5 sm:px-6 lg:px-8 space-y-8 bg-white">
                {/* Header Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/discountComponents/"
                            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            <span className="font-medium">Retour aux remises</span>
                        </Link>
                        <span className={`px-3 py-1 rounded-xl text-sm font-medium ${statusColors[status]}`}>
                            {status}
                        </span>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{discount.name}</h1>
                        <div className="flex items-center text-gray-600">
                            <Info className="h-5 w-5 mr-2 text-blue-600" />
                            <p className="text-sm">
                                {discount.discount_type === 'percentage' ?
                                    `Réduction de ${discount.value}% appliquée` :
                                    `Réduction fixe de ${formatCurrency(discount.value)}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Clock className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Période</h3>
                                <div className="space-y-1">
                                    <p className="text-gray-900">
                                        {new Date(discount.start_date).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-gray-900">
                                        {new Date(discount.end_date).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Tag className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Type de remise</h3>
                                <p className="text-gray-900 font-medium">
                                    {discount.discount_type === 'percentage' ?
                                        'Pourcentage' :
                                        'Montant fixe'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Percent className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Valeur</h3>
                                <p className="text-2xl font-semibold text-blue-600">
                                    {discount.discount_type === 'percentage' ?
                                        `${discount.value}%` :
                                        formatCurrency(discount.value)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Components List */}
                <div className="space-y-6">
                    {Object.entries(components).map(([type, items]) => (
                        items.length > 0 && (
                            <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="text-base font-semibold text-gray-700 capitalize">
                                        {type.replace(/_/g, ' ')}
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Composant</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix original</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix remisé</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Économies</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {items.map((component) => {
                                                const savings = component.original_price - component.current_price;
                                                const savingsPercentage = (savings / component.original_price) * 100;

                                                return (
                                                    <tr key={component.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-gray-900">{component.name}</td>
                                                        <td className="px-6 py-4 text-gray-500 line-through">
                                                            {formatCurrency(component.original_price)}
                                                        </td>
                                                        <td className="px-6 py-4 font-semibold text-green-600">
                                                            {formatCurrency(component.current_price)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-red-600">
                                                                    -{formatCurrency(savings)}
                                                                </span>
                                                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                                                    {savingsPercentage.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default DiscountShow;