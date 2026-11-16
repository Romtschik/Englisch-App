# Rail English

Web-App für Fachenglisch in Betriebseinführung und technischer Projektarbeit. Die erste Lernfassung enthält 32 Fachbegriffe in sechs Themen, beide Übersetzungsrichtungen, fällige Wiederholungen, Fehlerliste und drei fiktive Dokumentfälle mit Belegstellen und einer schriftlichen Transferaufgabe.

## Benutzung

- **Heute** empfiehlt Vokabeln und einen Dokumentfall.
- **Vokabeln** bietet fällige Karten, neue Begriffe und freies Üben.
- **Dokumente** verbindet englische Projektunterlagen mit Verständnisfragen und Musterformulierungen.
- **Fortschritt** zeigt den Lernstand, bietet einen JSON-Export und die ChatGPT-Anmeldung für geräteübergreifende Synchronisierung.

## Betrieb

[GitHub Pages](https://romtschik.github.io/Englisch-App/) bietet die Übungen mit Lernstand im jeweiligen Browser. Für gemeinsamen Lernstand auf dem iPhone und PC auf beiden Geräten [die App mit Anmeldung](https://rail-english-lernapp.hopefulmatch8.chatgpt.site/#fortschritt) verwenden. Lernstände aus verschiedenen Browsern oder Adressen sind voneinander getrennt.

Die Lernoberfläche startet öffentlich. Ohne Anmeldung bleiben Versuche im jeweiligen Browser. Mit Anmeldung speichert die App nur Übungsversuche unter der von Sites gelieferten Konto-Kennung in D1. Eine Anmeldung auf beiden Geräten mit demselben Konto synchronisiert den Stand. Einmalige Gastversuche aus diesem Browser werden beim Anmelden übernommen.

**Für später vorgemerkt:** Eigenes Cloudflare-Hosting mit Cloudflare Access als möglicher Weg zu privater Erreichbarkeit. Hörverstehen ist aus dem Projektumfang gestrichen.

## Lokal prüfen

```sh
node --test
node scripts/build.mjs
node scripts/preview.mjs
```

Die lokale Vorschau läuft unter http://127.0.0.1:4173 im Gastmodus. Inhalte stehen in `web/content.js`, Wiederholungslogik in `web/learning.js`, App und Gestaltung in `web/`. Der Build bündelt die Auslieferung als Sites-Worker.

`node scripts/build-pages.mjs` erstellt die Dateien in `dist/pages`. Für ein Pages-Update den Inhalt dieses Ordners in die Wurzel des Veröffentlichungsbranches `gh-pages` übernehmen und den Branch pushen.

Palette, Schriftdateien und Interaktionsmuster folgen Chillinal aus `D:\Chilli`. Die Schriftlizenzen stehen unter `web/fonts`. Die fiktiven Fälle sind eigenständig formuliert. Fachliche Referenzen stehen unter **Quellen & Hinweise** in der App.

Geplant sind weitere Dokumentfälle und ein Ausbau auf mindestens 200 fachlich geprüfte Begriffe.
