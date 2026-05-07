# Dělení se zbytkem

Vzdělávací webová aplikace v Reactu a TypeScriptu pro procvičování dělení se zbytkem. Aplikace generuje příklady do 100, ukládá nejlepší skóre do `localStorage` a používá dvoukrokový tok odpovědi: nejdříve výběr podílu ze čtyř možností, potom výběr zbytku ze čtyř možností.

## Spuštění lokálně

```bash
npm install
npm run dev
```

Vite vypíše lokální adresu, obvykle `http://localhost:5173`.

## Build

```bash
npm run build
```

Hotove staticke soubory budou ve slozce `dist`.

## Instalace na Android

Aplikace je připravená jako PWA. Po nasazení přes HTTPS ji lze v Chromu na Androidu
otevřít a v menu zvolit **Přidat na plochu** nebo **Instalovat aplikaci**.

Lokálně se dá instalovatelnost testovat na `http://localhost:5173`, protože localhost
má pro PWA výjimku. Na veřejném webu je potřeba HTTPS a nasazení do kořene domény.

## Náhled produkčního buildu

```bash
npm run preview
```

## Deploy na Vercel

1. Nahraj repozitář na GitHub, GitLab nebo Bitbucket.
2. Ve Vercelu zvol **Add New Project** a vyber tento repozitář.
3. Framework preset nastav na **Vite**.
4. Build command ponech `npm run build`.
5. Output directory ponech `dist`.
6. Klikni na **Deploy**.

Po deployi ověř, že jsou dostupné soubory `/manifest.webmanifest` a `/sw.js`.

Alternativně přes CLI:

```bash
npm i -g vercel
vercel
vercel --prod
```
