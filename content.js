export const topics = ["Meetings", "Betriebseinführung", "Dokumentation", "RAM", "Ersatzteile", "Verträge"];
const cards = [
  ["open-item","Meetings","open item","offener Punkt","Log the open item before the review.","Erfasse den offenen Punkt vor der Besprechung.","Ein Punkt, zu dem eine Klärung oder Maßnahme aussteht.","offener Punkt|offene Aufgabe"],
  ["follow-up","Meetings","follow up on","nachfassen bei","I’ll follow up on the missing test report.","Ich fasse wegen des fehlenden Prüfberichts nach.","Ein bereits angesprochenes Thema weiterverfolgen.","nachfassen bei|nachfassen|nachverfolgen"],
  ["due-date","Meetings","due date","Fälligkeitstermin","Could you confirm the due date?","Könntest du den Fälligkeitstermin bestätigen?","Der vereinbarte Termin, bis zu dem etwas erledigt sein soll.","Fälligkeitstermin|Fälligkeitsdatum"],
  ["action-owner","Meetings","action owner","verantwortliche Person für eine Maßnahme","Who is the action owner for this item?","Wer ist für diese Maßnahme verantwortlich?","Die Person, die für die Bearbeitung einer Maßnahme zuständig ist.","verantwortliche Person für eine Maßnahme|Maßnahmenverantwortlicher|Maßnahmenverantwortliche"],
  ["behind-schedule","Meetings","behind schedule","hinter dem Zeitplan","Testing is two days behind schedule.","Die Prüfungen liegen zwei Tage hinter dem Zeitplan.","Beschreibt einen Rückstand gegenüber dem vereinbarten Zeitplan.","hinter dem Zeitplan|im Verzug"],
  ["status-update","Meetings","status update","kurzer Bericht zum aktuellen Stand","Please send a status update by Friday.","Bitte schick bis Freitag einen kurzen Bericht zum aktuellen Stand.","Ein Überblick über Fortschritt, Hindernisse und nächste Schritte.","kurzer Bericht zum aktuellen Stand|Statusbericht|Statusupdate"],
  ["work-package","Meetings","work package","Arbeitspaket","The team has completed the first work package.","Das Team hat das erste Arbeitspaket abgeschlossen.","Abgegrenzter Umfang an Arbeit mit einem vorgesehenen Ergebnis.","Arbeitspaket"],
  ["milestone","Meetings","milestone","Meilenstein","The handover is our next milestone.","Die Übergabe ist unser nächster Meilenstein.","Ein wichtiges Ereignis oder Ergebnis im Projektplan.","Meilenstein"],
  ["entry-into-service","Betriebseinführung","entry into service","Aufnahme des Betriebs","We are preparing the fleet for entry into service.","Wir bereiten die Flotte auf die Aufnahme des Betriebs vor.","Übergang in den vorgesehenen Betrieb. Die vertragliche Bezeichnung kann abweichen.","Aufnahme des Betriebs|Betriebsaufnahme|Betriebseinführung"],
  ["commissioning","Betriebseinführung","commissioning","Inbetriebnahme","Commissioning is due to start next week.","Die Inbetriebnahme soll nächste Woche beginnen.","Technische Vorbereitung und Überprüfung vor der vorgesehenen Nutzung. Der Umfang hängt vom Projekt ab.","Inbetriebnahme"],
  ["handover","Betriebseinführung","handover","Übergabe","We need the signed report before handover.","Wir brauchen den unterschriebenen Bericht vor der Übergabe.","Übergabe von Fahrzeugen, Unterlagen oder Verantwortung an eine andere Partei.","Übergabe"],
  ["acceptance","Betriebseinführung","acceptance","Abnahme","The customer will confirm acceptance in writing.","Der Kunde bestätigt die Abnahme schriftlich.","Bestätigung der Abnahme nach den im Projekt geltenden Kriterien.","Abnahme|Annahme"],
  ["operational-readiness","Betriebseinführung","operational readiness","Betriebsbereitschaft","The review will assess operational readiness.","In der Besprechung wird die Betriebsbereitschaft beurteilt.","Bereitschaft für den vorgesehenen Betrieb, etwa von Fahrzeugen, Personal und Unterlagen.","Betriebsbereitschaft"],
  ["rolling-stock","Betriebseinführung","rolling stock","Schienenfahrzeuge","The operator is introducing new rolling stock.","Der Betreiber führt neue Schienenfahrzeuge ein.","Sammelbegriff für Fahrzeuge auf der Schiene.","Schienenfahrzeuge|Schienenfahrzeugbestand|Rollmaterial"],
  ["test-report","Dokumentation","test report","Prüfbericht","The test report lists two deviations.","Der Prüfbericht führt zwei Abweichungen auf.","Dokument, das die Durchführung und Ergebnisse einer Prüfung festhält.","Prüfbericht|Testbericht"],
  ["revision","Dokumentation","revision","Überarbeitungsstand","Please use the latest revision of the manual.","Bitte verwende den aktuellen Überarbeitungsstand des Handbuchs.","Fassung eines Dokuments nach einer Überarbeitung.","Überarbeitungsstand|Revision|Fassung"],
  ["technical-specification","Dokumentation","technical specification","technische Spezifikation","The technical specification defines the test conditions.","Die technische Spezifikation legt die Prüfbedingungen fest.","Ein Dokument, das technische Anforderungen oder Bedingungen festlegt.","technische Spezifikation"],
  ["operating-instructions","Dokumentation","operating instructions","Betriebsanleitung","The operating instructions are available in English.","Die Betriebsanleitung liegt auf Englisch vor.","Anweisungen zur Bedienung oder zum Betrieb.","Betriebsanleitung|Bedienungsanleitung|Betriebsanweisungen"],
  ["reliability","RAM","reliability","Zuverlässigkeit","The customer requested evidence of fleet reliability.","Der Kunde verlangte einen Nachweis der Flottenzuverlässigkeit.","Fähigkeit, eine geforderte Funktion über einen Zeitraum unter festgelegten Bedingungen zu erfüllen.","Zuverlässigkeit"],
  ["availability","RAM","availability","Verfügbarkeit","The contract defines how to calculate fleet availability.","Der Vertrag legt fest, wie die Flottenverfügbarkeit zu berechnen ist.","Beschreibt, in welchem Umfang ein System bei Bedarf einsatzfähig ist. Die Messdefinition steht im jeweiligen Kontext.","Verfügbarkeit"],
  ["maintainability","RAM","maintainability","Instandhaltbarkeit","The review also covers maintainability.","Die Prüfung umfasst auch die Instandhaltbarkeit.","Eigenschaft, die beschreibt, wie gut sich die geforderte Funktion erhalten oder wiederherstellen lässt.","Instandhaltbarkeit|Wartbarkeit"],
  ["downtime","RAM","downtime","Ausfallzeit","Log the start and end of each period of downtime.","Erfasse Beginn und Ende jeder Ausfallzeit.","Zeitraum, in dem ein Fahrzeug oder System gemäß der verwendeten Definition nicht verfügbar ist.","Ausfallzeit|Stillstandszeit|Stillstandsdauer"],
  ["failure-rate","RAM","failure rate","Ausfallrate","The report compares the observed failure rates.","Der Bericht vergleicht die beobachteten Ausfallraten.","Eine Rate für Ausfälle. Die Bezugsgröße, etwa Betriebszeit, muss angegeben sein.","Ausfallrate"],
  ["corrective-maintenance","RAM","corrective maintenance","korrektive Instandhaltung","The unit requires corrective maintenance.","Das Fahrzeug benötigt korrektive Instandhaltung.","Instandhaltung nach einem erkannten Fehler, um die geforderte Funktion wiederherzustellen.","korrektive Instandhaltung|Fehlerbehebung"],
  ["spare-part","Ersatzteile","spare part","Ersatzteil","The spare part is available from stock.","Das Ersatzteil ist ab Lager verfügbar.","Teil, das für den Ersatz eines verwendeten Teils vorgesehen ist.","Ersatzteil"],
  ["lead-time","Ersatzteile","lead time","Vorlaufzeit","The lead time from order to delivery is six weeks.","Die Zeit von der Bestellung bis zur Lieferung beträgt sechs Wochen.","Dauer zwischen zwei festgelegten Prozesspunkten, hier Bestellung und Lieferung.","Vorlaufzeit|Lieferzeit|Beschaffungszeit"],
  ["stock-level","Ersatzteile","stock level","Lagerbestand","We need to check the stock level before ordering.","Wir müssen den Lagerbestand vor der Bestellung prüfen.","Menge eines Artikels, die zu einem bestimmten Zeitpunkt auf Lager ist.","Lagerbestand|Bestandsmenge"],
  ["obsolete","Ersatzteile","obsolete","abgekündigt","The supplier says the part is obsolete.","Der Lieferant teilt mit, dass das Teil abgekündigt ist.","Im Ersatzteilkontext oft ein Hinweis auf ein nicht mehr angebotenes Teil. Der genaue Status ist beim Lieferanten zu prüfen.","abgekündigt|veraltet|nicht mehr verfügbar"],
  ["deliverable","Verträge","deliverable","zu lieferndes Ergebnis","The test report is a contractual deliverable.","Der Prüfbericht ist ein vertraglich zu lieferndes Ergebnis.","Vertraglich oder im Projekt festgelegtes Ergebnis, zum Beispiel eine Unterlage oder ein Nachweis.","zu lieferndes Ergebnis|Liefergegenstand|Lieferleistung"],
  ["acceptance-criterion","Verträge","acceptance criterion","Abnahmekriterium","The customer confirmed the acceptance criterion.","Der Kunde bestätigte das Abnahmekriterium.","Bedingung, die bei der Abnahme erfüllt sein muss.","Abnahmekriterium"],
  ["scope-of-supply","Verträge","scope of supply","Lieferumfang","Training materials are included in the scope of supply.","Schulungsunterlagen sind im Lieferumfang enthalten.","Die vertraglich erfassten Liefergegenstände und gegebenenfalls Leistungen.","Lieferumfang"],
  ["evidence","Verträge","evidence","Nachweis","The supplier shall provide evidence of compliance.","Der Lieferant muss die Einhaltung nachweisen.","Belege, die eine Behauptung oder erfüllte Anforderung stützen.","Nachweis|Beleg"]
];

export const words = cards.map(([id, topic, en, de, example, translation, explanation, answers]) => ({
  id, topic, en, de, example, translation, explanation, answers: answers.split("|")
}));

export const documents = [
  {
    id: "handover-note", topic: "Betriebseinführung", title: "Der fehlende Prüfbericht",
    type: "Projektmitteilung", level: "Einstieg", summary: "Frist, Verantwortung und offene Punkte aus einer Übergabemitteilung herauslesen.",
    terms: ["test-report", "handover", "open-item", "action-owner", "operational-readiness"],
    paragraphs: [
      "Before handover, the testing team must submit the signed test report to the project manager by 16:00 on Tuesday.",
      "The commissioning coordinator must update the list of open items before the readiness review on Wednesday. The customer will receive the updated list after the review.",
      "Two open items concern passenger information displays. They may remain open at handover only if the customer agrees in writing."
    ],
    questions: [
      {id:"team", text:"Who must submit the signed test report?", options:["The testing team","The project manager","The commissioning coordinator"], answer:0, ref:0, feedback:"Das Prüfteam muss den Bericht einreichen. Der Projektleiter ist der Empfänger."},
      {id:"time", text:"By what time must the report be submitted?", options:["By 16:00 on Wednesday","By 16:00 on Tuesday","After the review"], answer:1, ref:0, feedback:"By bezeichnet hier die späteste Frist: Dienstag um 16:00 Uhr."},
      {id:"exception", text:"When may the two display issues remain open at handover?", options:["If the testing team agrees verbally","If they are recorded in the test report","If the customer agrees in writing"], answer:2, ref:2, feedback:"Die Ausnahme setzt die schriftliche Zustimmung des Kunden voraus."}
    ],
    transfer: {task:"Bitte auf Englisch um den unterschriebenen Prüfbericht und nenne die Frist.", model:"Could you send the signed test report to the project manager by 16:00 on Tuesday, please?"}
  },
  {
    id: "fleet-availability", topic: "RAM", title: "Flottenverfügbarkeit nachweisen",
    type: "Vertragsauszug", level: "Fortgeschritten", summary: "Verfügbarkeitsziel, Ausnahmen und Nachweise aus einer fiktiven RAM-Klausel ableiten.",
    terms: ["availability", "downtime", "evidence", "deliverable"],
    paragraphs: [
      "The supplier shall demonstrate a monthly fleet availability of at least 98%. For this exercise, availability is defined as (eligible scheduled vehicle-hours minus chargeable downtime) divided by eligible scheduled vehicle-hours.",
      "Eligible scheduled vehicle-hours exclude customer-cancelled operating periods. Unplanned vehicle failures during eligible periods count as chargeable downtime. This example assumes 1,000 eligible vehicle-hours and 25 hours of chargeable downtime.",
      "The supplier shall provide the calculation and a record of exclusions to the customer within five working days after the end of the month."
    ],
    questions: [
      {id:"target", text:"What is the required minimum monthly fleet availability?", options:["95%","97.5%","98%"], answer:2, ref:0, feedback:"At least bedeutet mindestens. Der Grenzwert liegt bei 98 %."},
      {id:"excluded", text:"Which periods are excluded from eligible scheduled vehicle-hours?", options:["Periods cancelled by the customer","All periods with unplanned vehicle failures","The first five working days"], answer:0, ref:1, feedback:"Kundenseitig abgesagte Betriebszeiten zählen in dieser Übung nicht zur Bezugszeit."},
      {id:"calculation", text:"What is the result for the example month?", options:["98.0%, target met","97.5%, target missed","97.5%, target met"], answer:1, ref:1, feedback:"Nach Absatz 1 gilt (1.000 − 25) ÷ 1.000 = 97,5 %. Das unterschreitet die geforderten 98 %."},
      {id:"proof", text:"What must the supplier provide?", options:["Only the availability percentage","A maintenance schedule","The calculation and a record of exclusions"], answer:2, ref:2, feedback:"Beide Nachweise sind innerhalb von fünf Arbeitstagen nach Monatsende zu liefern."}
    ],
    transfer: {task:"Erkläre dem Kunden auf Englisch das Ergebnis und kündige den Nachweis an.", model:"Fleet availability was 97.5% this month, below the contractual target of 98%. We will send the calculation and the record of exclusions within five working days of month-end."}
  },
  {
    id: "spares-spec", topic: "Ersatzteile", title: "Kritische Ersatzteile beschaffen",
    type: "Technische Spezifikation", level: "Einstieg", summary: "Lieferzeiten und Mindestbestand für eine neue Fahrzeugflotte unterscheiden.",
    terms: ["spare-part", "lead-time", "stock-level", "scope-of-supply"],
    paragraphs: [
      "The supplier shall include a recommended spare parts list in the handover package. For each item, the list shall state the part number and the estimated lead time from order to delivery.",
      "The depot shall hold at least two door control units before the first vehicle enters service. For this exercise, the supplier estimates a lead time of six weeks for a door control unit.",
      "If the supplier learns that a listed part is being discontinued, the supplier shall notify the operator and propose a compatible replacement."
    ],
    questions: [
      {id:"list", text:"What must the list state for each part?", options:["The part number and estimated lead time","The weight and stock level","The installation procedure"], answer:0, ref:0, feedback:"Die Liste nennt Teilenummer und geschätzte Zeit von der Bestellung bis zur Lieferung."},
      {id:"stock", text:"What is the minimum stock of door control units before entry into service?", options:["One unit","Two units","Six units"], answer:1, ref:1, feedback:"Die Mindestmenge beträgt zwei Stück. Sechs Wochen ist die geschätzte Lieferzeit."},
      {id:"replacement", text:"What must the supplier do if a listed part is discontinued?", options:["Remove the part without notice","Increase the stock automatically","Notify the operator and propose a compatible replacement"], answer:2, ref:2, feedback:"Der Lieferant muss den Betreiber informieren und ein kompatibles Ersatzteil vorschlagen."}
    ],
    transfer: {task:"Bitte den Lieferanten auf Englisch um Bestätigung der aktuellen Lieferzeit.", model:"Could you confirm the current lead time for the door control unit and let us know whether delivery before entry into service is possible?"}
  }
];
