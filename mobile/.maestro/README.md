# Maestro E2E Tests für RetroLibrary

Diese Dokumentation beschreibt, wie du die End-to-End-Tests für die RetroLibrary Mobile App mit Maestro ausführst.

## Was ist Maestro?

Maestro ist ein einfach zu bedienendes E2E-Testing-Framework für mobile Apps. Es verwendet YAML-basierte Test-Flows und funktioniert out-of-the-box mit React Native und Expo.

## Voraussetzungen

### Maestro installieren

Maestro ist bereits auf deinem System installiert. Falls du es neu installieren musst:

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

Danach Terminal neu starten oder PATH aktualisieren:

```bash
export PATH="$PATH":"$HOME/.maestro/bin"
```

### App vorbereiten

Die App muss entweder:
- Im iOS Simulator laufen
- Im Android Emulator laufen
- Auf einem physischen Gerät per USB verbunden sein

## Tests ausführen

### Alle Tests ausführen

```bash
npm run test:e2e
```

Oder direkt mit Maestro:

```bash
maestro test .maestro
```

### Einzelnen Test ausführen

```bash
npm run test:e2e:single .maestro/01-navigate-to-search.yaml
```

Oder:

```bash
maestro test .maestro/01-navigate-to-search.yaml
```

### Tests im Watch-Modus

Im Watch-Modus werden Tests automatisch bei Änderungen neu ausgeführt:

```bash
npm run test:e2e:watch
```

## Vorhandene Test-Flows

### 1. `01-navigate-to-search.yaml`
**Beschreibung**: Testet die Navigation zur Spielesuche
**Tags**: `navigation`, `smoke`
**Was wird getestet**:
- App öffnen
- Empty State wird angezeigt
- Klick auf "Spiele durchsuchen"
- Navigation zum Search Screen

### 2. `02-search-for-game.yaml`
**Beschreibung**: Vollständiger Spiele-Suchflow
**Tags**: `search`, `critical`
**Was wird getestet**:
- Navigation zur Suche via FAB
- Spielname eingeben ("Super Mario")
- Suche absenden
- Warten auf Ergebnisse

### 3. `03-toggle-view-mode.yaml`
**Beschreibung**: View Mode zwischen Grid und List wechseln
**Tags**: `ui`, `view-mode`
**Was wird getestet**:
- Grid View aktivieren
- Zu List View wechseln
- Zurück zu Grid View

### 4. `04-library-search-expand.yaml`
**Beschreibung**: Expandierbare Suche im Library Header
**Tags**: `ui`, `search`, `library`
**Was wird getestet**:
- Such-Button klicken
- Suchfeld expandiert
- Text eingeben
- Clear Button funktioniert
- Suchfeld schließen

## Workflow für lokales Testen

### iOS Simulator

1. Starte die App im Simulator:
   ```bash
   npm run ios
   ```

2. Warte, bis die App vollständig geladen ist

3. Führe Tests aus:
   ```bash
   npm run test:e2e
   ```

### Android Emulator

1. Starte einen Android Emulator

2. Starte die App:
   ```bash
   npm run android
   ```

3. Warte, bis die App vollständig geladen ist

4. Führe Tests aus:
   ```bash
   npm run test:e2e
   ```

## TestIDs in der App

Die folgenden `testID` Props wurden zu wichtigen UI-Elementen hinzugefügt:

### LibraryHeader
- `search-toggle-button` - Such-Icon zum Expandieren
- `view-mode-grid-button` - Grid View Button
- `view-mode-list-button` - List View Button
- `library-search-input` - Suchfeld im Header
- `search-clear-button` - Clear Button für Suche

### FloatingActionButton
- `fab-add-games` - Floating Action Button zum Hinzufügen von Spielen

### EmptyLibraryState
- `empty-library-state` - Container des Empty States
- `empty-state-add-games-button` - "Spiele durchsuchen" Button

### GameSearchScreen
- `game-search-input` - Spielname Eingabefeld
- `search-submit-button` - "Spiele suchen" Button

## Neue Tests schreiben

### Basis-Struktur eines Tests

```yaml
# Beschreibung des Tests
---
appId: host.exp.Exponent
name: Test Name
tags:
  - tag1
  - tag2

---
# Test-Schritte
- launchApp

- tapOn:
    id: "element-testid"

- assertVisible: "Text auf dem Screen"

- inputText: "Eingabe"
```

### Häufig verwendete Commands

```yaml
# App starten
- launchApp

# Auf Element tippen (via testID)
- tapOn:
    id: "testID"

# Auf Text tippen
- tapOn: "Button Text"

# Text eingeben
- inputText: "Text"

# Keyboard ausblenden
- hideKeyboard

# Warten
- waitForAnimationToEnd:
    timeout: 5000

# Assertion: Element ist sichtbar
- assertVisible:
    id: "testID"

# Assertion: Text ist sichtbar
- assertVisible: "Erwarteter Text"

# Assertion: Element ist NICHT sichtbar
- assertNotVisible:
    id: "testID"

# Scrollen
- scroll

# Screenshot erstellen
- takeScreenshot: screenshot-name
```

## Debugging

### Test läuft nicht?

1. **Prüfe, ob die App läuft**:
   ```bash
   maestro test --format=junit .maestro/01-navigate-to-search.yaml
   ```

2. **Verwende den Maestro Studio** für interaktives Debugging:
   ```bash
   maestro studio
   ```

3. **Screenshots bei Fehlern**:
   Füge `takeScreenshot` Commands vor kritischen Schritten hinzu:
   ```yaml
   - takeScreenshot: before-tap
   - tapOn:
       id: "button"
   - takeScreenshot: after-tap
   ```

### Typische Probleme

**Problem**: `Element not found`
**Lösung**:
- Prüfe, ob testID korrekt ist
- Warte länger mit `waitForAnimationToEnd`
- Verifiziere, dass das Element wirklich sichtbar ist

**Problem**: Test ist zu schnell
**Lösung**: Füge Wartezeiten hinzu:
```yaml
- waitForAnimationToEnd:
    timeout: 3000
```

**Problem**: Keyboard verdeckt Elemente
**Lösung**: Keyboard ausblenden:
```yaml
- hideKeyboard
```

## CI/CD Integration

### GitHub Actions Beispiel

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Maestro
        run: curl -Ls "https://get.maestro.mobile.dev" | bash

      - name: Start iOS Simulator
        run: |
          xcrun simctl boot "iPhone 15"

      - name: Start Expo
        run: npm start &

      - name: Run E2E Tests
        run: npm run test:e2e
```

## Best Practices

1. **Verwende aussagekräftige testIDs**: `search-button` statt `btn1`

2. **Tests sollten unabhängig sein**: Jeder Test sollte eigenständig funktionieren

3. **Verwende Tags**: Gruppiere Tests nach Funktionalität (smoke, critical, ui)

4. **Kurze Waits**: Nur so lange warten wie nötig

5. **Klare Assertions**: Verifiziere erwartetes Verhalten explizit

6. **Meaningful Names**: Test-Namen sollten klar beschreiben, was getestet wird

## Weitere Ressourcen

- [Maestro Dokumentation](https://maestro.mobile.dev/)
- [Maestro CLI Reference](https://maestro.mobile.dev/cli)
- [Maestro Best Practices](https://maestro.mobile.dev/best-practices)

## Support

Bei Fragen oder Problemen:
1. Prüfe die Maestro Logs
2. Nutze `maestro studio` für interaktives Debugging
3. Schaue in die [Maestro Docs](https://maestro.mobile.dev/)
