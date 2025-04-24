import { useState, useEffect } from 'react';
import { Layout } from '@/Layouts/layout';
import toast from 'react-hot-toast';
import { Link, useForm, usePage } from '@inertiajs/react';
import { can } from '@/helpers';

interface Country {
  name: string;
  cca2: string;
  capital?: string[];
}

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    hasCompte: false,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const { flash, auth } = usePage().props;
  const user = auth.user;

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
      .then((res) => res.json())
      .then((data) => {
        const sortedCountries = data
          .map((c: any) => ({
            name: c.name.common,
            cca2: c.cca2,
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      });

    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);

  const fetchCitiesForCountry = (countryCode: string) => {
    setLoadingCities(true);
    setCities([]);

    fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ country: countryCode }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.length) setCities(data.data);
        setLoadingCities(false);
      })
      .catch(() => setLoadingCities(false));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const selectedCountry = countries.find((c) => c.cca2 === countryCode);

    if (selectedCountry) {
      setData('country', selectedCountry.name);
      fetchCitiesForCountry(selectedCountry.name);
      setData('city', '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/customers', {
      onSuccess: () => toast.success('Client créé avec succès'),
      onError: () => toast.error('Erreur lors de la création'),
    });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-full p-4 sm:px-6 lg:px-8 space-y-6 bg-white">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-gray-900">Ajouter un Nouveau Client</h1>
          <p className="text-xs text-gray-600">Renseignez les informations du client</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="space-y-3 w-full">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Jean Dupont"
                  required
                />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="client@example.com"
                  required
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Coordonnées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Téléphone *
                </label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0612345678"
                  required
                  pattern="^\d{10}$"
                />
                {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="flex items-center gap-2 mt-5">
                <input
                  type="checkbox"
                  checked={data.hasCompte}
                  onChange={(e) => setData('hasCompte', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">
                  Compte client activé
                </label>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Adresse */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Adresse postale *
              </label>
              <input
                type="text"
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="123 Rue Principale"
                required
              />
              {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
            </div>

            <hr className="border-gray-200" />

            {/* Localisation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Pays *
                </label>
                <select
                  value={countries.find((c) => c.name === data.country)?.cca2 || ''}
                  onChange={handleCountryChange}
                  className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionnez un pays</option>
                  {countries.map((country) => (
                    <option key={country.cca2} value={country.cca2}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Ville *
                </label>
                <select
                  value={data.city}
                  onChange={(e) => setData('city', e.target.value)}
                  className="w-full rounded-md border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={!data.country || loadingCities}
                  required
                >
                  <option value="">
                    {loadingCities ? 'Chargement...' : cities.length ? 'Choisissez une ville' : 'Sélectionnez un pays'}
                  </option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 w-full">
            <Link
              href="/customers"
              className="px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Annuler
            </Link>
            {can(user, 'manage_users') && (
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm disabled:opacity-50"
              >
                {processing ? 'Enregistrement...' : 'Créer le Client'}
              </button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}