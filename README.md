# Biohacking Daily (MVP)

Minimalna web‑appka (PWA) do codziennych nawyków + streak. 
Przygotowana pod monetyzację: subskrypcje (wkrótce) + reklamy.

## Uruchomienie lokalne
Otwórz `index.html` w przeglądarce.

## Monetyzacja
Ustaw linki płatności w `app.js`:

```js
const PRICING = {
  monthlyUrl: 'TU_WKLEJ_LINK_SUBSKRYPCJI_27_ZL',
  upsellUrl: 'TU_WKLEJ_LINK_PAKIETU_47_ZL'
};
```

Możesz użyć Stripe (Payment Links / Checkout) lub Gumroad.

## Następne kroki
- podpięcie płatności (Stripe / Gumroad)
- test płatności i lejek
- optymalizacja CTA
