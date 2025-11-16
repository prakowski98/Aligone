'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Lock, Mail, ArrowRight, Shield, AlertCircle, User, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }

    if (formData.password.length < 8) {
      setError('Hasło musi mieć co najmniej 8 znaków');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Rejestracja nie powiodła się. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 8) return { strength: 1, label: 'Słabe', color: 'text-red-600' };
    if (password.length < 12) return { strength: 2, label: 'Średnie', color: 'text-yellow-600' };
    return { strength: 3, label: 'Silne', color: 'text-green-600' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  aligone
                </span>
              </h1>
            </Link>
            <h2 className="text-2xl font-bold mb-2">Dołącz do Aligone!</h2>
            <p className="text-muted-foreground">
              Utwórz konto i zacznij kupować lub sprzedawać już dziś
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl">Załóż konto</CardTitle>
              <CardDescription>
                Wypełnij formularz, aby utworzyć nowe konto
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Darmowe wystawianie</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Bezpieczne płatności</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>Ochrona kupujących</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Imię
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Jan"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Nazwisko
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Kowalski"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Nazwa użytkownika
                  </label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="jankowalski"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Nazwa użytkownika będzie widoczna dla innych
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Adres email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="twoj.email@example.pl"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Hasło
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Minimum 8 znaków"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              level <= strength.strength
                                ? strength.strength === 1
                                  ? 'bg-red-500'
                                  : strength.strength === 2
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                      {strength.label && (
                        <p className={`text-xs font-medium ${strength.color}`}>
                          Siła hasła: {strength.label}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Potwierdź hasło
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Wpisz hasło ponownie"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Hasła nie są identyczne
                    </p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Hasła są zgodne
                    </p>
                  )}
                </div>

                <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    Akceptuję{' '}
                    <Link href="/regulamin" className="text-primary hover:underline font-medium">
                      Regulamin
                    </Link>
                    {' '}i{' '}
                    <Link href="/prywatnosc" className="text-primary hover:underline font-medium">
                      Politykę Prywatności
                    </Link>
                    {' '}Aligone
                  </label>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Tworzenie konta...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Załóż konto
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      lub
                    </span>
                  </div>
                </div>

                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full h-11 text-base" type="button">
                    Mam już konto - Zaloguj się
                  </Button>
                </Link>
              </CardFooter>
            </form>
          </Card>

          {/* Security Info */}
          <div className="mt-6 p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Twoje dane są bezpieczne</p>
                <p className="text-xs text-muted-foreground">
                  Stosujemy najwyższe standardy bezpieczeństwa, aby chronić Twoje dane osobowe.
                  Nigdy nie udostępniamy ich podmiotom trzecim bez Twojej zgody.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
