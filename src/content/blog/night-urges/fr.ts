import type { BlogArticle } from '../types';

/**
 * French version — conversational "tu" register, idiomatic rewrite (not a
 * literal translation of en.ts).
 */
const article: BlogArticle = {
  slug: 'night-urges',
  lang: 'fr',
  title: 'Pourquoi les pulsions frappent plus fort la nuit (et ce qui marche vraiment après 23h)',
  description:
    'Toute la journée, ça va. Puis il est 23h47. Les pulsions nocturnes ne sont pas une faiblesse — ce sont cinq déclencheurs qui s’empilent d’un coup. Voici le mécanisme, et les solutions qui tiennent.',
  datePublished: '2026-07-23',
  dateModified: '2026-07-23',
  readingMinutes: 7,
  ctaLabel: 'Voir comment Axiom fonctionne',
  ctaText:
    'Axiom apprend ton heure dangereuse personnelle à partir de tes propres journaux honnêtes et te prévient avant qu’elle arrive — en privé. Rien de ce que tu enregistres ne quitte ton téléphone.',
  blocks: [
    {
      kind: 'p',
      text: 'Il y a un schéma que presque tout le monde en récupération reconnaît. Toute la journée, ça va. Boulot, sport, dîner — l’habitude te traverse à peine l’esprit, et quand elle le fait, dire « non » ne coûte rien. Puis il est 23h47, tu es au lit avec ton téléphone, la maison est silencieuse, et le même « non » qui était gratuit à 14h exige soudain tout ce que tu as.',
    },
    {
      kind: 'p',
      text: 'La plupart des gens lisent ça comme un problème de caractère : fort le jour, faible la nuit. Ce n’en est pas un. C’est un problème d’empilement. La fin de soirée est le seul moment de la journée où presque tous les déclencheurs connus se déclenchent en même temps — et une fois que tu vois la pile, les solutions deviennent presque ennuyeuses tellement elles sont évidentes.',
    },
    { kind: 'h2', text: 'Les cinq choses qui s’empilent à la nuit tombée' },
    { kind: 'h3', text: '1. Ton self-control est une batterie, et elle est vide' },
    {
      kind: 'p',
      text: 'Quelle que soit la vraie nature du self-control — les chercheurs débattent des détails — sa forme pratique ne fait pas débat : résister devient plus dur à mesure que tu es éveillé depuis longtemps et que tu as pris des décisions. En fin de soirée, tu as passé la journée entière à dire non au bouton snooze, aux grignotages, aux distractions, aux disputes. La pulsion qui débarque à minuit n’est pas plus forte que celle de 14h. Tu la négocies simplement avec le réservoir à sec.',
    },
    { kind: 'h3', text: '2. Tu es seul, et personne ne le saura' },
    {
      kind: 'p',
      text: 'Cette habitude vit de l’intimité. Le jour, il y a des collègues, la famille, des portes ouvertes, la simple possibilité d’être vu. La nuit, tout ça disparaît, et le plus vieux complice du monde vient s’asseoir à côté de toi : personne ne le saura jamais. Le secret n’est pas une condition annexe de l’habitude — c’est son habitat.',
    },
    { kind: 'h3', text: '3. Rien ne se dispute ton attention' },
    {
      kind: 'p',
      text: 'Une pulsion à 14h doit se battre contre ton travail, tes trajets, les autres. Une pulsion à minuit ne se bat contre rien. L’ennui plus une chambre silencieuse, c’est un vide — et l’habitude est le remplisseur de vide le plus répété que ton cerveau possède. Elle se proposera, serviable, chaque fois que l’agenda sera vide.',
    },
    { kind: 'h3', text: '4. Le téléphone est déjà dans ta main' },
    {
      kind: 'p',
      text: 'Pour la plupart des gens, la distance totale entre « pulsion » et « rechute » tient en quatre appuis, exécutés sur un appareil déjà posé sur leur poitrine. Aucune autre addiction de l’histoire n’a eu son déclencheur, son système de livraison et son intimité regroupés dans le dernier objet que tu touches avant de dormir. Le dispositif physique compte bien plus que ce que presque tout le monde veut admettre.',
    },
    { kind: 'h3', text: '5. Ton cerveau a chimiquement fini sa journée' },
    {
      kind: 'p',
      text: 'Tard le soir, tu es fatigué, ton humeur est à son point le plus bas de la journée, et la partie raisonnable de ta pensée — celle qui pèse les conséquences — est la première que la fatigue éteint. La version courte : la personne allongée dans le lit à minuit n’est tout simplement pas le même négociateur que celui qui, au petit-déjeuner, promettait avec assurance que ce soir serait différent. Faire un plan à 9h et attendre de ta version de minuit qu’elle l’exécute par la seule volonté est un pari perdant.',
    },
    {
      kind: 'callout',
      title: 'La version en une phrase',
      text: 'Les pulsions nocturnes semblent écrasantes parce que cinq déclencheurs partent en même temps : un réservoir de self-control vide, une intimité garantie, zéro concurrence pour ton attention, un téléphone à portée de main et un cerveau fatigué. Retire une ou deux couches et la pile s’effondre.',
    },
    { kind: 'h2', text: 'Ton risque a une forme — trouve la tienne' },
    {
      kind: 'p',
      text: 'Demande aux gens quand ils rechutent, la plupart répondent « au hasard, n’importe quand ». Demande-leur de vraiment le noter pendant quelques semaines, et autre chose apparaît : un pic net et personnel, généralement dans les deux dernières heures avant le sommeil, souvent certains jours précis de la semaine. « Au hasard » semble impossible à combattre. Un pic de 23h à 1h le dimanche et le jeudi ? Ce n’est qu’un problème d’emploi du temps.',
    },
    {
      kind: 'p',
      text: 'C’est le geste le plus sous-estimé de toute la récupération : arrêter de traiter l’habitude comme une force mystérieuse et commencer à la traiter comme un schéma horodaté. On ne peut pas se battre contre du brouillard. Contre un rendez-vous fixé, si, parfaitement.',
    },
    { kind: 'h2', text: 'Ce qui ne marche pas' },
    {
      kind: 'p',
      text: 'Serrer les dents à minuit — allongé dans le lit avec le téléphone, les yeux fermés, à essayer de vaincre la pulsion à la pure volonté — a un bilan désastreux, exactement pour les raisons de la pile ci-dessus : tu te bats à l’heure de ta volonté la plus faible, sur le terrain de l’habitude, avec l’appareil de livraison dans la main. Perdre ce combat chaque nuit est ensuite lu comme la preuve d’être cassé — ce que ce n’est pas. C’est la preuve que le champ de bataille a été mal choisi.',
    },
    { kind: 'h2', text: 'Ce qui marche vraiment après 23h' },
    {
      kind: 'p',
      text: 'Tout ce qui marche la nuit partage une propriété : ça a été mis en place avant la nuit. Ta version de minuit exécute ; c’est ta version de jour qui décide.',
    },
    {
      kind: 'list',
      items: [
        'Sors le téléphone de la chambre. Charge-le dans la cuisine, achète un réveil à dix euros. Ce seul changement supprime les couches 2, 3 et 4 de la pile en un geste, et les gens rapportent constamment qu’il fait plus que tout le reste réuni.',
        'Si le téléphone doit rester, rallonge le chemin. Aucun bloqueur n’arrêtera ta version déterminée de 2h du matin, mais chaque étape supplémentaire achète les 10 à 20 minutes dont une pulsion a besoin pour culminer et passer. Tu ne construis pas un mur, tu construis un délai.',
        'Donne un script à la fenêtre dangereuse. La pulsion remplit le temps vide, alors termine la journée avec quelque chose qui occupe les mains et les yeux — douche, étirements, livre papier, rangement. Ennuyeux, c’est très bien. Ennuyeux, c’est le but.',
        'Avance ton coucher pour devancer le pic. Si ta fenêtre dangereuse enregistrée va de 23h à 1h, être endormi à 22h30 n’est pas esquiver le combat — c’est le gagner. La pression du sommeil est de ton côté, si tu t’en sers.',
        'Traverse une vague exprès. Une pulsion culmine et passe en 10 à 20 minutes environ, que tu agisses ou non. Une fois que tu en as tenu une — éveillé, inconfortable, et toujours clean — les pulsions nocturnes perdent définitivement leur aura d’inévitabilité.',
        'Note aussi les quasi-dérapages. Les nuits où tu as failli glisser sont les données les plus précieuses que tu possèdes : elles marquent l’heure et l’humeur exactes où vit ton schéma, sans te coûter ta série.',
      ],
    },
    { kind: 'h2', text: 'Si tu glisses quand même une nuit' },
    {
      kind: 'p',
      text: 'Note-le honnêtement et va dormir. Ne passe pas le reste de la nuit dans une spirale de honte — la frénésie du « de toute façon j’ai déjà échoué » qui suit un écart fait bien plus de dégâts que l’écart lui-même, et l’envie de recommencer est la plus forte dans les 48 heures qui suivent. Une mauvaise nuit, notée et suivie d’un matin normal, c’est un point de données. La même nuit, plus la spirale, c’est un recul. La différence entre les deux est une décision que tu peux encore prendre à 1h du matin.',
    },
    {
      kind: 'faq',
      items: [
        {
          q: 'Pourquoi les pulsions sont-elles tellement pires quand je suis fatigué ?',
          a: 'La fatigue touche ta capacité à freiner les impulsions avant de toucher les impulsions elles-mêmes — la pulsion arrive donc à pleine puissance pendant que le système de freinage tourne sur ses dernières gouttes. C’est aussi pourquoi les nuits blanches, le décalage horaire et le sommeil haché apparaissent si souvent juste avant les rechutes dans les journaux des gens. Protéger le sommeil n’est pas un conseil annexe ; c’est l’un des leviers principaux.',
        },
        {
          q: 'Les bloqueurs aident-ils vraiment la nuit ?',
          a: 'Comme mur, non — une personne déterminée vient à bout de n’importe quel bloqueur. Comme délai, oui : une pulsion n’a besoin que de 10 à 20 minutes pour culminer et passer, et chaque étape supplémentaire entre toi et le contenu dépense cette fenêtre. Combine un bloqueur avec la règle du téléphone-hors-de-la-chambre, et la pulsion expire généralement avant que le contournement soit prêt.',
        },
        {
          q: 'Et si je me réveille à 3h du matin avec une pulsion ?',
          a: 'La fenêtre du demi-réveil est réellement dangereuse, parce que la partie réfléchie de la pensée est la dernière à se rallumer. Les deux choses qui marchent sont mécaniques, pas mentales : que le téléphone soit physiquement hors de portée, pour que le pilote automatique somnolent n’ait rien à exécuter ; et sortir du lit un instant — de l’eau, les toilettes, trente secondes debout — ce qui suffit généralement à remettre le cerveau pensant en ligne.',
        },
        {
          q: 'Consommer tard la nuit, est-ce pire qu’en journée ?',
          a: 'Ça se cumule différemment : ça te coûte du sommeil, et un sommeil court affaiblit le self-control du soir suivant, ce qui rend la nuit d’après plus risquée — une vraie spirale, qui apparaît clairement dans les journaux des gens. Casser d’abord le maillon nocturne est la raison pour laquelle beaucoup sentent l’habitude entière se desserrer une fois leurs soirées transformées.',
        },
      ],
    },
  ],
};

export default article;
