# Migracije.eu

## O tem projektu

Migracije.eu je projekt napravljen za PRAKTIKUM II, njegov namen je vizualizacija slovenskih delovnih migracij za lažjo predstavo in enostavno navigiranje in ogledovanje le teh podatkov. Projekt je namenjen tako navadnim uporabnikom kot tudi morebitnim strokovnjakom, katerih želja je izvedeti nekaj več o slovenskih delovnih migracijah na bolj preprost oz. bolj interaktiven način. 

Leto izdelave: 2024

## Dostopnost 

Projekt je v splošnem dostopen na: https://migracije.eu/

## Instalacija

Projekt je napisan v react + vite programski kodi, uporaba projekta je dostopna s klonirajem git repositorija komanda: git clone (https://github.com/toorkk/PRAKTIKUM2), potem je potrebo migrirati v datoteko MigracijePK2 in uporabiti komando npm install za korektno instalacijo. Projekt se lahko zažene s uporabo komande npm run dev.

```
git clone https://github.com/toorkk/PRAKTIKUM2
cd .\MigracijePK2\
npm install
npm run dev
```
Na računalniku je potrebna namestitev Node.js za zaganjanje projekta!


## Funkcionalnosti

- Zemljevid Slovenije, ki prikazuje slovenske občine in regije, klik na katere omogoča ogled podatkov in grafov za vsako občino/regijo posebej.

- Navigacijski menu, kateri omogoča navigiranje na občine s pomočjo klika na izbrano občino.

- Stran s podrobnostmi na katerih so prikazane bolj specifične informacije in grafične reprezentacije podatkov občin. Navigiranje na podrobne informacije je mogoče s klikom na link pop-upa vsake občine.

- Stran implementira drsnik, ki omogoča manipuliranje zemljevida tako, da se na zemljevidu vizualizira indeks delovnih migracij za specifično leto.

- Grafične reprezentacije za presek delovnih migracij s drugimi podatki kot so plače, starost itd.

## Zaslonske slike

![Screenshot 1](https://github.com/user-attachments/assets/7496ca48-7d5d-4c4e-897b-12fdbabb44f5)
Zaslonska slika naslovne strani projekta Migracije.eu.

![Screenshot 2](https://github.com/user-attachments/assets/5db80c7f-78ee-4ef3-9060-6426045ef106)
Zaslonska slika strani Podrobnosti projekta Migracije.eu.

## Vir podatkov

Vsi podatki so bili pridobljeni iz spletne strani OPSI (https://podatki.gov.si/)
Za zdruzevanje in manipulacijo teh podatkov smo uporabljali Python Pandas skripte.
Vsi podatki uporabljeni v projektu so dostopni v datoteki data, vsi podatki so v tej datoteki priloženi v obliki .json.

## Avtorji

Za pripravo projekta so poskrbeli študentu Feri UM, študijske smeri IPT UNI 2:

Vasja Rimele,
Anže Hameršak,
Alen Peklar
