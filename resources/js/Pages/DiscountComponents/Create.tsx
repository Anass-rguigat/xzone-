import { Layout } from '@/Layouts/layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface ComponentGroup {
  name: string;
  items: any[];
  type: string;
}

interface Props {
  rams: any[];
  processors: any[];
  motherboards: any[];
  raid_controllers: any[];
  chassis: any[];
  fiber_optic_cards: any[];
  hard_drives: any[];
  network_cards: any[];
  power_supplies: any[];
  cooling_solutions: any[];
  graphic_cards: any[];
  expansion_cards: any[];
  cable_connector: any[];
  battery: any[];
}

export default function Create({ ...componentGroups }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    discount_type: 'percentage',
    value: 0,
    start_date: '',
    end_date: '',
    components: [],
  });

  const { flash } = usePage().props;

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);

  const toggleComponent = (type: string, id: number) => {
    const componentIndex = data.components.findIndex(
      (c: any) => c.type === type && c[`${type.slice(0, -1)}_id`] === id
    );

    if (componentIndex > -1) {
      setData('components', data.components.filter((_, i) => i !== componentIndex));
    } else {
      setData('components', [
        ...data.components,
        { [`${type.slice(0, -1)}_id`]: id, type }
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('discountComponents.store'), {
      onSuccess: () => toast.success('Remise créée avec succès'),
      onError: () => toast.error('Erreur lors de la création')
    });
  };

  const groups: ComponentGroup[] = [
    { name: 'RAMs', items: componentGroups.rams, type: 'rams' },
    { name: 'Processeurs', items: componentGroups.processors, type: 'processors' },
    { name: 'Cartes mères', items: componentGroups.motherboards, type: 'motherboards' },
    { name: 'Contrôleurs RAID', items: componentGroups.raid_controllers, type: 'raid_controllers' },
    { name: 'Châssis', items: componentGroups.chassis, type: 'chassis' },
    { name: 'Cartes fibre optique', items: componentGroups.fiber_optic_cards, type: 'fiber_optic_cards' },
    { name: 'Disques durs', items: componentGroups.hard_drives, type: 'hard_drives' },
    { name: 'Cartes réseau', items: componentGroups.network_cards, type: 'network_cards' },
    { name: 'Alimentations', items: componentGroups.power_supplies, type: 'power_supplies' },
    { name: 'Refroidissements', items: componentGroups.cooling_solutions, type: 'cooling_solutions' },
    { name: 'Cartes graphiques', items: componentGroups.graphic_cards, type: 'graphic_cards' },
    { name: "Cartes d'extension", items: componentGroups.expansion_cards, type: 'expansion_cards' },
    { name: 'Connecteurs câble', items: componentGroups.cable_connector, type: 'cable_connectors' },
    { name: 'Batteries', items: componentGroups.battery, type: 'batteries' },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-full p-5 sm:px-6 lg:px-8 space-y-8 bg-white">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">Créer une nouvelle remise</h1>
            <p className="text-gray-600">Configurez les paramètres de la remise promotionnelle</p>
          </div>
          <Link 
            href={route('discountComponents.index')}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Retour
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Nom de la remise
                </label>
                <input
                  type="text"
                  value={data.name} required
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <hr className="border-gray-200" />

              {/* Type et valeur */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Type de remise
                  </label>
                  <select required
                    value={data.discount_type}
                    onChange={(e) => setData('discount_type', e.target.value)}
                    className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="percentage">Pourcentage</option>
                    <option value="fixed">Montant fixe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Valeur {data.discount_type === 'percentage' ? '(%)' : '(€)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={data.value}
                    onChange={(e) => setData('value', parseFloat(e.target.value))}
                    className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.value && <p className="text-red-600 text-sm mt-1">{errors.value}</p>}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Date de début
                  </label>
                  <input
                    type="date"
                    required
                    value={data.start_date}
                    onChange={(e) => setData('start_date', e.target.value)}
                    className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    required
                    value={data.end_date}
                    onChange={(e) => setData('end_date', e.target.value)}
                    className="w-full rounded-xl border-gray-300 bg-white px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Composants concernés */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Composants éligibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((group) => (
                  <div key={group.type} className="border rounded-xl p-4 bg-gray-50">
                    <h4 className="font-medium mb-3">{group.name}</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {group.items.length === 0 ? (
                        <p className="text-gray-500 text-sm">Aucun élément disponible</p>
                      ) : (
                        group.items.map((item: any) => {
                          const isSelected = data.components.some(
                            (c: any) => c.type === group.type && c[`${group.type.slice(0, -1)}_id`] === item.id
                          );

                          return (
                            <label 
                              key={item.id}
                              className={`flex items-center p-2 rounded cursor-pointer ${
                                isSelected ? 'bg-blue-100' : 'hover:bg-gray-200'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleComponent(group.type, item.id)}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm">{item.name}</span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <Link
                href="/discountComponents"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {processing ? 'Enregistrement...' : 'Créer la remise'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}