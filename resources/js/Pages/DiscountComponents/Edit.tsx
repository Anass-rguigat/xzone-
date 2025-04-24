import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react'; 
import { Layout } from '@/Layouts/layout';
import { usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { can } from '@/helpers';

const EditDiscount = ({
    discount,
    rams,
    hard_drives,
    processors,
    power_supplies,
    motherboards,
    network_cards,
    raid_controllers,
    cooling_solutions,
    chassis,
    graphic_cards,
    fiber_optic_cards,
    expansion_cards,
    cable_connectors,
    batteries,
}: any) => {
    const { flash, auth } = usePage().props;
    const user = auth.user;
    const [formData, setFormData] = useState({
        name: discount.name,
        discount_type: discount.discount_type,
        value: discount.value,
        start_date: discount.start_date,
        end_date: discount.end_date,
        selectedComponents: {
            rams: discount.rams ? discount.rams.map((ram: any) => ram.id) : [],
            hard_drives: discount.hard_drives ? discount.hard_drives.map((hardDrive: any) => hardDrive.id) : [],
            processors: discount.processors ? discount.processors.map((processor: any) => processor.id) : [],
            power_supplies: discount.power_supplies ? discount.power_supplies.map((powerSupply: any) => powerSupply.id) : [],
            motherboards: discount.motherboards ? discount.motherboards.map((motherboard: any) => motherboard.id) : [],
            network_cards: discount.network_cards ? discount.network_cards.map((networkCard: any) => networkCard.id) : [],
            raid_controllers: discount.raid_controllers ? discount.raid_controllers.map((raidController: any) => raidController.id) : [],
            cooling_solutions: discount.cooling_solutions ? discount.cooling_solutions.map((coolingSolution: any) => coolingSolution.id) : [],
            chassis: discount.chassis ? discount.chassis.map((chassis: any) => chassis.id) : [],
            graphic_cards: discount.graphic_cards ? discount.graphic_cards.map((graphicCard: any) => graphicCard.id) : [],
            fiber_optic_cards: discount.fiber_optic_cards ? discount.fiber_optic_cards.map((fiberOpticCard: any) => fiberOpticCard.id) : [],
            expansion_cards: discount.expansion_cards ? discount.expansion_cards.map((expansionCard: any) => expansionCard.id) : [],
            batteries: discount.batteries ? discount.batteries.map((battery: any) => battery.id) : [],
            cable_connectors: discount.cable_connectors ? discount.cable_connectors.map((cable: any) => cable.id) : []
        },
    });
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
      }, [flash]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleComponentChange = (componentType: string, itemId: number) => {
        const updatedComponents = { ...formData.selectedComponents };
        const componentList = updatedComponents[componentType];

        if (componentList.includes(itemId)) {
            updatedComponents[componentType] = componentList.filter((id: number) => id !== itemId);
        } else {
            updatedComponents[componentType] = [...componentList, itemId];
        }

        setFormData(prevData => ({
            ...prevData,
            selectedComponents: updatedComponents,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const components = Object.keys(formData.selectedComponents).map((componentType) => {
            return formData.selectedComponents[componentType].map((id: number) => ({
                [`${componentType.slice(0, -1)}_id`]: id,
                type: componentType
            }));
        }).flat();

        Inertia.put(route('discountComponents.update', discount.id), {
            ...formData,
            components,
        }, {
            onSuccess: () => toast.success('Remise créée avec succès'),
      onError: () => toast.error('Erreur lors de la création')
        });
    };

    const componentGroups = [
        { name: 'RAM', type: 'rams', items: rams },
        { name: 'Disques durs', type: 'hard_drives', items: hard_drives },
        { name: 'Processeurs', type: 'processors', items: processors },
        { name: 'Alimentations', type: 'power_supplies', items: power_supplies },
        { name: 'Cartes mères', type: 'motherboards', items: motherboards },
        { name: 'Cartes réseau', type: 'network_cards', items: network_cards },
        { name: 'Contrôleurs RAID', type: 'raid_controllers', items: raid_controllers },
        { name: 'Systèmes de refroidissement', type: 'cooling_solutions', items: cooling_solutions },
        { name: 'Châssis', type: 'chassis', items: chassis },
        { name: 'Cartes graphiques', type: 'graphic_cards', items: graphic_cards },
        { name: 'Cartes fibre optique', type: 'fiber_optic_cards', items: fiber_optic_cards },
        { name: 'Cartes d\'expansion', type: 'expansion_cards', items: expansion_cards },
        { name: 'Câbles', type: 'cable_connectors', items: cable_connectors },
        { name: 'Batteries', type: 'batteries', items: batteries },
    ];

    return (
        <Layout>
            <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-lg font-semibold text-gray-900">Modifier la remise</h1>
                        <p className="text-xs text-gray-600">Mettez à jour les paramètres de la remise promotionnelle</p>
                    </div>
                    <Link 
                        href="/discountComponents"
                        className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        ← Retour
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        {/* Informations de base */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Nom de la remise
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Type de remise
                                    </label>
                                    <select
                                        name="discount_type"
                                        value={formData.discount_type}
                                        onChange={handleChange}
                                        className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="percentage">Pourcentage</option>
                                        <option value="fixed">Montant fixe</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Valeur {formData.discount_type === 'percentage' ? '(%)' : '(€)'}
                                    </label>
                                    <input
                                        type="number"
                                        name="value"
                                        value={formData.value}
                                        onChange={handleChange}
                                        className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Date de début
                                </label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                    Date de fin
                                </label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Composants concernés */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-900">Composants éligibles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {componentGroups.map((group: any) => {
                                    const itemsArray = Array.isArray(group.items) ? group.items : [];
                                    
                                    return (
                                        <div key={group.type} className="border rounded-md p-3 bg-gray-50">
                                            <h4 className="text-sm font-medium mb-2">{group.name}</h4>
                                            <div className="space-y-1 max-h-40 overflow-y-auto">
                                                {itemsArray.length === 0 ? (
                                                    <p className="text-gray-500 text-xs">Aucun élément disponible</p>
                                                ) : (
                                                    itemsArray.map((item: any) => {
                                                        const isSelected = formData.selectedComponents[group.type].includes(item.id);
                                                        return (
                                                            <label 
                                                                key={item.id}
                                                                className={`flex items-center p-1.5 rounded cursor-pointer ${
                                                                    isSelected ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-100'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    onChange={() => handleComponentChange(group.type, item.id)}
                                                                    className="h-3.5 w-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                                />
                                                                <span className="ml-2 text-xs">{item.name}</span>
                                                            </label>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Link
                                href="/discountComponents"
                                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Annuler
                            </Link>
                            {can(user, 'Edit_Discounts_Composants') && (
                                <button
                                    type="submit"
                                    className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
                                >
                                    Enregistrer
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default EditDiscount;