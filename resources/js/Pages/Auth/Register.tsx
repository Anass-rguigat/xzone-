import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";

interface Country {
  name: string;
  cca2: string;
}

export default function Register({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    country: "",
    password: "",
    password_confirmation: "",
  });

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
  }, []);

  const fetchCitiesForCountry = (countryName: string) => {
    setLoadingCities(true);
    setCities([]);

    fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ country: countryName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setCities(data.data);
        setLoadingCities(false);
      })
      .catch(() => setLoadingCities(false));
  };

  const handleCountryChange = (value: string) => {
    const country = countries.find(c => c.cca2 === value);
    if (country) {
      setData('country', country.name);
      fetchCitiesForCountry(country.name);
      setData('city', '');
    }
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation"),
    });
  };

  return (
    <div className={cn("min-h-screen bg-gray-50 flex items-center justify-center p-4", className)} {...props}>
      <Head title="Création de compte" />
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Créer un compte</CardTitle>
          <CardDescription>
            Renseignez vos informations personnelles pour créer votre compte
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section Informations personnelles */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium">Informations personnelles</h3>
              <div className="border-b" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Jean Dupont"
                autoComplete="name"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                placeholder="0612345678"
                pattern="^\d{10}$"
                autoComplete="tel"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={data.address}
                onChange={(e) => setData("address", e.target.value)}
                placeholder="addresse"
                pattern="^\d{10}$"
                autoComplete="tel"
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Pays *</Label>
              <select
                value={countries.find(c => c.name === data.country)?.cca2 || ''}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Sélectionnez un pays</option>
                {countries.map((country) => (
                  <option key={country.cca2} value={country.cca2}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <select
                value={data.city}
                onChange={(e) => setData("city", e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={!data.country || loadingCities}
              >
                <option value="">
                  {loadingCities ? 'Chargement...' : cities.length ? 'Choisissez une ville' : 'Sélectionnez un pays'}
                </option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
              {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
            </div>

            {/* Section Informations de connexion */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium">Informations de connexion</h3>
              <div className="border-b" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                placeholder="exemple@email.com"
                autoComplete="email"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                autoComplete="new-password"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirmation *</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData("password_confirmation", e.target.value)}
                autoComplete="new-password"
              />
              {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
            </div>

            <div className="md:col-span-2">
              <Button 
                type="submit" 
                className="w-full mt-4"
                disabled={processing}
              >
                {processing ? "Création en cours..." : "Créer mon compte"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            Vous avez déjà un compte ?{" "}
            <Link 
              href={route("login")} 
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}