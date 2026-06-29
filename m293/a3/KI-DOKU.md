# KI-Doku

## KI-vergleich

Ich haben ein Vergleich zwischen den Gemini-modelle (Gemini 3.5 flash)
mit Antigravity CLI und einem lokalen Modell (gemma4:31b) gemacht.

### Gemini

Das modell war extrem schnell, und hat die Website
recht gut implementieren können.

Allerdings hat es immernoch einige komische Sachen gemacht. Ich habe
explizit gesagt, es soll die Produktbilder nicht selber generieren, und dass
ich sie später addieren werde. Jedoch hat Gemini das ignoriert und die Bilder trotzdem selber
generiert (Die generierten Bilder waren *nicht* gut).

Zudem hat Gemini, ohne das ich dafür gefragt habe, ein Web-basiertes "Terminal"
implementiert. Das Terminal war nicht wirklich gut und auch unnötig. Dementsprechend
habe ich es entfernt.

Zudem hat Gemini teils sehr komische Beschreibungen eingefügt, welche
ich dann anpasste.

Ich habe explizit dafür gefragt, der Code solle "Clean" sein,
was aber nicht wirklich ernst genommen wurde.

### Gemma

Ich habe nicht nur Gemma4:31b als lokales Modell probiert,
sondern auch kleinere. Zum Beispiel qwen3.5:9b. Jedoch
habe ich herausgefunden, dass die kleineren modelle zwar
extrem schell sind, jedoch auch einfachste Websiten nicht
implementieren können. Das kleine Modell hat fast immer meine Prompts
nicht verstanden oder Tool-Calls halluziniert. Das gemma4:31b
Modell ist viel grösser & langsamer, aber dementsprechend auch
mehr "intelligent".

Als Chat-Interface habe ich "Continue" in VSCode benutzt (Es ist
das einzige das einigermassen funktioniert hat).

Das Modell war extrem langsam. Es hat etwa 30min gedauert um
ein Paar Hundert Zeilen zu schreiben. Zwar ist das ein Hardware-
Problem. Mein laptop hat eine RTX 5060 Laptop GPU, welche aber immer
noch viel zu langsam ist.

Die resultierende Website war *deutlich* weniger beanspruchend und viel simpler.

Da Gemma die Produktbilder nicht anschauen konnte, waren die Beschreibungen
nicht gerade korrekt.

Jedoch funktionierte die Website. Das design war minimal, aber
es funktionierte immernoch, und Gemma hat auch nicht versucht extra
Features zu implementieren, für welche ich nicht gefragt habe.

Tatsächlich ist der code von Gemma deutlich "cleaner"
und lesbarer. Ob das ist, weil ich es explizit gesagt habe,
oder weil das Resultat einfach viel einfacher war, weiss ich nicht.

### Nutzwertanalyse

| Kriterium | Gewicht | Gemini | Gemma |
| ---       | ---     | ---    | ---   |
| Datensicherheit | 0.1 | 0 | 1 |
| Geschw. | 0.2 | 1 | 0 |
| Resultat | 0.4 | 0.6 | 0.3 |
| Komisches verhalten| 0.1 | 0.3 | 0.3 |
| Kosten | 0.2 | 0.7 | 0.8 |
| Total |  1 | 0.61 | 0.41 |

> Mit komischem verhalten wird gemeint, wie oft es sachen macht, die ein Mensch nie machen würde.

## KI einsatz

Der Code der Website wurde fast exklusiv von KI erstellt. Allerdings wurden
die meisten Beschreibungen, alle Bilder, alle Ideen und die ganze Doku ohne KI gemacht.

Ich habe eine [Datei](spec.md) erstellt, welche als "Anleitung" dienen sollte
Ich habe beiden KIs diese exakte datei gegeben, und gesagt,
es soll es implementieren.

Bei der Gemini Version habe ich viele Sachen angepasst und es ist
auch die hauptwebsite. Weil die Gemma Version einfach nicht wirklich
gut war, und es extrem lang dauern würde, habe ich nach der ersten
Prompt nicht wirklich weitergemacht.

Als beispiel habe ich folgende prompt benutzt:

```
can you make it so if you hover over a certain part of a product image in the detail view, it will zoom in? some of the text is a little small for some tshirts
```
