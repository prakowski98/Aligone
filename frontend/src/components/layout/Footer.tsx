import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    'Firma': [
      { label: 'O nas', href: '/o-nas' },
      { label: 'Kariera', href: '/kariera' },
      { label: 'Dla prasy', href: '/prasa' },
      { label: 'Blog', href: '/blog' },
      { label: 'Współpraca', href: '/wspolpraca' },
    ],
    'Pomoc': [
      { label: 'Centrum pomocy', href: '/pomoc' },
      { label: 'Bezpieczeństwo', href: '/bezpieczenstwo' },
      { label: 'Kontakt', href: '/kontakt' },
      { label: 'Najczęściej zadawane pytania', href: '/faq' },
      { label: 'Rozwiązywanie problemów', href: '/problemy' },
    ],
    'Kupowanie': [
      { label: 'Jak kupować', href: '/jak-kupowac' },
      { label: 'Programy ochrony kupujących', href: '/ochrona-kupujacych' },
      { label: 'Allegro Smart!', href: '/smart' },
      { label: 'Płatności', href: '/platnosci' },
      { label: 'Dostawa', href: '/dostawa' },
    ],
    'Sprzedawanie': [
      { label: 'Jak sprzedawać', href: '/jak-sprzedawac' },
      { label: 'Programy dla sprzedawców', href: '/dla-sprzedawcow' },
      { label: 'Cennik', href: '/cennik' },
      { label: 'Pomoc dla sprzedawców', href: '/pomoc-sprzedawcy' },
      { label: 'Narzędzia sprzedawcy', href: '/narzedzia' },
    ],
    'Zasady i bezpieczeństwo': [
      { label: 'Regulamin', href: '/regulamin' },
      { label: 'Polityka prywatności', href: '/prywatnosc' },
      { label: 'Polityka cookies', href: '/cookies' },
      { label: 'Ochrona danych osobowych', href: '/ochrona-danych' },
      { label: 'Mapa strony', href: '/mapa' },
    ],
  };

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <div className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  aligone
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Nowoczesna platforma aukcyjna. Kupuj i sprzedawaj z zaufaniem.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-foreground text-sm">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>&copy; {new Date().getFullYear()} Aligone sp. z o.o. Wszelkie prawa zastrzeżone.</p>
              <p className="text-xs">
                Korzystanie z serwisu oznacza akceptację{' '}
                <Link href="/regulamin" className="hover:text-primary underline">
                  Regulaminu
                </Link>{' '}
                i{' '}
                <Link href="/prywatnosc" className="hover:text-primary underline">
                  Polityki prywatności
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="font-semibold">🇵🇱</span>
                <span>Polska</span>
              </div>
              <span className="hidden lg:inline">•</span>
              <span>Bezpieczne płatności</span>
              <span className="hidden lg:inline">•</span>
              <span>Ochrona kupujących</span>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📦</div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Darmowa dostawa</h4>
                <p className="text-xs text-muted-foreground">
                  Dołącz do programu Smart! i korzystaj z darmowej dostawy
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🛡️</div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Bezpieczeństwo</h4>
                <p className="text-xs text-muted-foreground">
                  Kupuj bezpiecznie z Programem Ochrony Kupujących
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">💬</div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Pomoc 24/7</h4>
                <p className="text-xs text-muted-foreground">
                  Nasz zespół jest zawsze gotowy, aby Ci pomóc
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
