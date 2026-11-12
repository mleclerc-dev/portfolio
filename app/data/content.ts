// Long-form, bilingual content lives here (UI labels live in i18n/locales/*.json).

export type Locale = 'fr' | 'en'
export type Localized = Record<Locale, string>

export const person = {
  name: 'Maxime Leclerc',
  email: 'mleclerc.dev@gmail.com',
  location: 'Urville-Nacqueville',
  /** Portrait in /public (e.g. '/me.jpg'); while empty, the About section shows the mark instead. */
  photo: '',
  /** The CV, generated from /cv into /public/cv */
  cv: { fr: '/cv/maxime-leclerc-cv-fr.pdf', en: '/cv/maxime-leclerc-cv-en.pdf' } as Localized,
  // Add public profile URLs here; empty ones are not shown.
  links: [
    { label: 'GitHub', href: 'https://github.com/mleclerc-dev' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/maxime-leclerc-24a879a5/' },
  ],
}

export type SceneId = 'taxi' | 'kaplouf' | 'mariage' | 'noel'

export interface Shot {
  /** Image, or the poster when there is a video */
  src: string
  /** Optional looping clip (MP4) */
  video?: string
  width: number
  height: number
  alt: Localized
}

export interface Project {
  id: SceneId
  /** URL segment of the project page */
  slug: string
  /** What I did on it, for a client reading the page */
  role: Localized
  name: Localized
  for: Localized
  tagline: Localized
  pitch: Localized
  /** Two sentences on the scope, for the home page tile */
  summary: Localized
  /** The main building blocks, a few words each */
  scope: Localized[]
  features: Localized[]
  stack: string[]
  status: Localized
  /** What kind of thing it is, in a few words */
  kind: Localized
  /** Screenshot that follows the cursor in the project list */
  cover: string
  /** Live, in use, or still being built */
  state: 'live' | 'used' | 'wip'
  /** Year shown on the museum label; left out when unknown */
  year?: string
  /** Client work or personal project */
  origin: 'client' | 'personal'
  url?: string
}

export const projects: Project[] = [
  {
    id: 'taxi',
    slug: 'move-taxi',
    origin: 'client',
    role: {
      fr: 'Pour un client : conception, développement front et back, back-office et mise en ligne.',
      en: 'For a client: design, front-end and back-end development, back office and launch.',
    },
    name: { fr: 'Move Taxi Moto', en: 'Move Taxi Moto' },
    for: { fr: 'les voyageurs pressés, à Paris', en: 'travellers in a hurry, in Paris' },
    tagline: {
      fr: 'Un moto-taxi réservé en trois clics, au prix connu d’avance.',
      en: 'A motorbike taxi booked in three clicks, at a price known upfront.',
    },
    pitch: {
      fr: 'Un service de moto-taxi à Paris et en Île-de-France, vers les aéroports, les gares, ou à la journée. J’ai construit le site, le parcours de réservation avec son calcul de tarif, et le back-office qui fait tourner les courses.',
      en: 'A motorbike taxi service in Paris and the Île-de-France region, to airports, stations, or by the day. I built the site, the booking flow with its fare calculation, and the back office that runs the rides.',
    },
    features: [
      {
        fr: 'Site vitrine et réservation en Nuxt, rendu côté serveur pour le référencement',
        en: 'Marketing site and booking in Nuxt, server-rendered for search engines',
      },
      {
        fr: 'Calcul du tarif au trajet ou en mise à disposition, sur carte, prix forfaitaire affiché avant de commander',
        en: 'Fare calculated per ride or by the hour, on a map, flat price shown before ordering',
      },
      {
        fr: 'Comptes clients, annulation gratuite jusqu’à 24 h avant la prise en charge',
        en: 'Customer accounts, free cancellation up to 24 hours before pick-up',
      },
      {
        fr: 'Back-office : courses, chauffeurs et clients business',
        en: 'Back office: rides, drivers and business customers',
      },
    ],
    summary: {
      fr: 'Tout le service, en production : le site, la réservation avec le tarif calculé sur carte, les comptes clients, et le back-office qui fait tourner les courses et les chauffeurs.',
      en: 'The whole service, in production: the site, booking with the fare worked out on a map, customer accounts, and the back office that runs the rides and the drivers.',
    },
    scope: [
      { fr: 'Site vitrine', en: 'Marketing site' },
      { fr: 'Réservation & tarifs', en: 'Booking & fares' },
      { fr: 'Comptes clients', en: 'Customer accounts' },
      { fr: 'Back-office', en: 'Back office' },
    ],
    stack: ['Nuxt', 'Vue', 'Google Maps', 'Laravel', 'PHP 8.5'],
    status: { fr: 'En ligne', en: 'Live' },
    kind: { fr: 'Site, réservation & back-office', en: 'Site, booking & back office' },
    cover: '/projects/taxi-home.webp',
    state: 'live',
    url: 'https://www.movetaxi.fr/',
  },
  {
    id: 'kaplouf',
    slug: 'kaplouf',
    year: '2026',
    origin: 'personal',
    role: {
      fr: 'Projet perso : game design, moteur 3D, interface, identité de marque et build Android.',
      en: 'Personal project: game design, 3D engine, interface, brand identity and Android build.',
    },
    name: { fr: 'Kaplouf', en: 'Kaplouf' },
    for: { fr: 'les joueurs de stratégie mobile', en: 'mobile strategy players' },
    tagline: { fr: 'Reprends la banquise.', en: 'Take back the ice.' },
    pitch: {
      fr: 'Un jeu de stratégie mobile en 3D. La Bande du Grand Morse a gelé la colonie : on reconstruit le village de pingouins, on arme le Brise-glace, puis on débarque île par île. Une bataille dure moins de 90 secondes.',
      en: 'A 3D mobile strategy game. The Walrus Gang has frozen the colony: you rebuild the penguin village, arm the Icebreaker, then land island by island. A battle lasts under 90 seconds.',
    },
    features: [
      {
        fr: 'Un village en 3D (three.js) qui grandit avec de vrais minuteurs de construction',
        en: 'A 3D village (three.js) that grows on real build timers',
      },
      {
        fr: 'Des batailles simulées en pas fixe, rejouées à l’identique dans les tests',
        en: 'Fixed-step battle simulation, replayed bit-for-bit in tests',
      },
      {
        fr: 'Ginette, la doyenne de la colonie, qui conseille sans jamais gronder',
        en: 'Ginette, the colony’s elder, who advises and never scolds',
      },
      {
        fr: 'Android avec Capacitor ; Firebase pour les comptes, les sauvegardes et la config à distance',
        en: 'Android through Capacitor; Firebase for accounts, saves and remote config',
      },
      {
        fr: 'Cinq langues, et une identité de marque générée par script',
        en: 'Five languages, and brand assets generated by script',
      },
    ],
    summary: {
      fr: 'Un jeu de stratégie complet en 3D : un village de pingouins qui se reconstruit, des batailles simulées de moins de 90 secondes, une version Android et cinq langues.',
      en: 'A full 3D strategy game: a penguin village to rebuild, simulated battles under 90 seconds, an Android build and five languages.',
    },
    scope: [
      { fr: 'Moteur 3D', en: '3D engine' },
      { fr: 'Batailles simulées', en: 'Simulated battles' },
      { fr: 'Appli Android', en: 'Android app' },
      { fr: 'Cinq langues', en: 'Five languages' },
    ],
    stack: ['TypeScript', 'three.js', 'Vite', 'Capacitor', 'Firebase'],
    status: { fr: 'En développement', en: 'In development' },
    kind: { fr: 'Jeu mobile en 3D', en: '3D mobile game' },
    cover: '/projects/kaplouf-battle-wide.webp',
    state: 'wip',
  },
  {
    id: 'mariage',
    slug: 'mariage',
    year: '2026',
    origin: 'personal',
    role: {
      fr: 'Projet perso : de l’idée à l’appli installée sur nos deux téléphones, design compris.',
      en: 'Personal project: from the idea to the app installed on both our phones, design included.',
    },
    name: { fr: 'Mariage', en: 'Mariage' },
    for: { fr: 'nous deux', en: 'the two of us' },
    tagline: {
      fr: 'Tout le mariage dans une appli, de la première liste au jour J.',
      en: 'The whole wedding in one app, from the first guest list to the big day.',
    },
    pitch: {
      fr: 'Une appli pour organiser tout un mariage à deux, sur le même espace : les invités par foyer et leurs réponses, le budget avec ses devis et ses paiements, le plan de table, le planning et le déroulé du jour J, l’hébergement et les navettes, jusqu’aux cadeaux et aux mots de remerciement. On ajoute la tante Monique, et le traiteur, les tables et le vin d’honneur se recalculent.',
      en: 'An app to plan a whole wedding as a couple, in one shared space: guests by household and their replies, the budget with its quotes and payments, the seating plan, the schedule and the big-day run sheet, lodging and shuttles, all the way to gifts and thank-you notes. Add Aunt Monique, and the catering, the tables and the drinks reception are recalculated.',
    },
    summary: {
      fr: 'Invités et réponses, budget et devis, plan de table, planning et déroulé du jour J, hébergement et navettes, cadeaux : tout se recalcule ensemble, et on l’organise à deux sur le même espace.',
      en: 'Guests and replies, budget and quotes, seating, schedule and big-day run sheet, lodging and shuttles, gifts: it all adds up together, and the two of you plan it in one shared space.',
    },
    scope: [
      { fr: 'Invités & RSVP', en: 'Guests & RSVP' },
      { fr: 'Budget & devis', en: 'Budget & quotes' },
      { fr: 'Plan de table', en: 'Seating plan' },
      { fr: 'Planning & jour J', en: 'Schedule & big day' },
      { fr: 'Hébergement & navettes', en: 'Lodging & shuttles' },
      { fr: 'Cadeaux & mercis', en: 'Gifts & thank-yous' },
    ],
    features: [
      {
        fr: 'Invités par foyer : statut, repas ou vin d’honneur, adulte ou enfant, régime, en un clic ; import et export CSV',
        en: 'Guests by household: status, meal or drinks only, adult or child, diet, in one click; CSV import and export',
      },
      {
        fr: 'Faire-part suivis, et réponses par lien secret sur une page aux couleurs du mariage, sans compte pour les invités',
        en: 'Invitations tracked, and replies through a secret link on a page in the wedding’s colours, no account for guests',
      },
      {
        fr: 'Budget par poste, devis comparés, paiements et échéances, financement, simulateur « Et si… ? »',
        en: 'Budget by item, quotes side by side, payments and due dates, funding, a “What if…?” simulator',
      },
      {
        fr: 'Plan de table en glisser-déposer avec le décor de la salle, placement automatique par foyer, version imprimable',
        en: 'Drag-and-drop seating plan with the room’s layout, automatic placement by household, printable version',
      },
      {
        fr: 'Rétroplanning avec checklist, déroulé du jour J, carnet des prestataires',
        en: 'Countdown schedule with a checklist, big-day run sheet, vendor book',
      },
      {
        fr: 'Hébergement et navettes des invités, cadeaux reçus et remerciements à envoyer',
        en: 'Guest lodging and shuttles, gifts received and thank-you notes to send',
      },
      {
        fr: 'À deux sur le même espace, recherche ⌘K, exports PDF (traiteur, plan de table, déroulé) ; PWA installable, mode sombre',
        en: 'Both partners in one space, ⌘K search, PDF exports (catering, seating, run sheet); installable PWA, dark mode',
      },
    ],
    stack: ['Laravel', 'Inertia', 'Vue 3', 'Tailwind CSS', 'shadcn-vue', 'PWA'],
    status: { fr: 'En ligne', en: 'Live' },
    kind: { fr: 'Appli web d’organisation de mariage', en: 'Wedding planning web app' },
    cover: '/projects/mariage-dashboard.webp',
    state: 'live',
  },
  {
    id: 'noel',
    slug: 'noel-des-copains',
    year: '2026',
    origin: 'personal',
    role: {
      fr: 'Projet perso : conception, design et développement, utilisé chaque Noël par les copains.',
      en: 'Personal project: design and development, used every Christmas by our friends.',
    },
    name: { fr: 'Le Noël des copains', en: 'Le Noël des copains' },
    for: { fr: 'les copains, à Noël', en: 'friends, at Christmas' },
    tagline: {
      fr: 'Un tirage que personne ne voit, pas même l’organisateur.',
      en: 'A draw nobody sees, not even the organiser.',
    },
    pitch: {
      fr: 'On entre les prénoms et les couples qui ne doivent pas se piocher, on lance le tirage. Chacun découvre sa personne avec son propre lien : un tour de roue, une étiquette, et la liste d’envies de l’heureux élu.',
      en: 'Enter the names and the couples who must not draw each other, then run the draw. Everyone finds out who they got through their own link: a spin of the wheel, a gift tag, and the lucky one’s wish list.',
    },
    features: [
      {
        fr: 'Exclusions entre participants, sans compte à créer',
        en: 'Exclusions between participants, no account to create',
      },
      {
        fr: 'Trois tirages au choix : cadeaux, déguisements, Noël des enfants',
        en: 'Three draws to pick from: gifts, costumes, a children’s Christmas',
      },
      {
        fr: 'Un lien secret par participant, envoyé par e-mail en un clic',
        en: 'One secret link per participant, emailed in one click',
      },
      {
        fr: 'Listes d’envies, import et export des participants',
        en: 'Wish lists, participant import and export',
      },
    ],
    summary: {
      fr: 'Un tirage au sort secret, avec les couples qui ne doivent pas se piocher, un lien par participant envoyé par e-mail et les listes d’envies. Les copains s’en servent chaque Noël.',
      en: 'A secret draw, with the couples who must not draw each other, one link per participant sent by email, and wish lists. Our friends use it every Christmas.',
    },
    scope: [
      { fr: 'Exclusions', en: 'Exclusions' },
      { fr: 'Liens secrets', en: 'Secret links' },
      { fr: 'Listes d’envies', en: 'Wish lists' },
      { fr: '3 tirages', en: '3 draw types' },
    ],
    stack: ['Laravel', 'Inertia', 'Vue 3', 'Tailwind CSS'],
    status: { fr: 'En ligne', en: 'Live' },
    kind: { fr: 'Appli web de tirage au sort', en: 'Gift-draw web app' },
    cover: '/projects/noel-home.webp',
    state: 'live',
  },
]

export const shots = {
  taxi: {
    home: {
      src: '/projects/taxi-home.webp',
      width: 1800,
      height: 1125,
      alt: {
        fr: 'L’accueil de movetaxi.fr : un moto-taxi devant l’Arc de triomphe, et le formulaire de réservation (date, horaire, départ, arrivée).',
        en: 'The movetaxi.fr home page: a motorbike taxi by the Arc de Triomphe, and the booking form (date, time, pick-up, drop-off).',
      },
    },
    booking: {
      src: '/projects/taxi-booking.webp',
      width: 1800,
      height: 1125,
      alt: {
        fr: 'La page de réservation : une carte de Paris et de sa banlieue, et le formulaire « Calculer votre tarif ».',
        en: 'The booking page: a map of Paris and its suburbs, and the “Calculate your fare” form.',
      },
    },
    pricing: {
      src: '/projects/taxi-pricing.webp',
      width: 1800,
      height: 1125,
      alt: {
        fr: 'La page des forfaits : Roissy-Charles-de-Gaulle à partir de 95 €, Orly 70 €, Le Bourget 75 €.',
        en: 'The flat rates page: Roissy-Charles-de-Gaulle from €95, Orly €70, Le Bourget €75.',
      },
    },
    mobile: {
      src: '/projects/taxi-mobile.webp',
      width: 780,
      height: 1688,
      alt: {
        fr: 'Le formulaire de réservation de Move Taxi sur téléphone.',
        en: 'The Move Taxi booking form on a phone.',
      },
    },
  },
  kaplouf: {
    battle: {
      src: '/projects/kaplouf-battle-wide.webp',
      width: 2400,
      height: 1200,
      alt: {
        fr: 'Une île enneigée vue du ciel : forts et tours de la Bande, et l’armée de pingouins qui débarque du Brise-glace.',
        en: 'A snowy island from above: the Gang’s forts and towers, and the penguin army landing from the Icebreaker.',
      },
    },
    soldier: {
      src: '/projects/kaplouf-soldier.webp',
      width: 1200,
      height: 1200,
      alt: { fr: '', en: '' },
    },
    ginette: {
      src: '/projects/kaplouf-ginette.webp',
      width: 780,
      height: 1688,
      alt: {
        fr: 'Le village au début du jeu, et Ginette, écharpe dorée et tricot en main : « La Bande du Grand Morse a gelé la colonie. »',
        en: 'The village at the start of the game, and Ginette, golden scarf and knitting in hand, explaining that the Walrus Gang froze the colony.',
      },
    },
    island: {
      src: '/projects/kaplouf-battle-poster.webp',
      video: '/projects/kaplouf-battle.mp4',
      width: 600,
      height: 1298,
      alt: {
        fr: 'Vidéo d’une bataille : « À l’abordage ! », le Brise-glace approche du Repaire du Soigneur, les escouades de pingouins débarquent et attaquent les défenses.',
        en: 'Video of a battle: “À l’abordage!”, the Icebreaker nears the Healer’s Lair, the penguin squads land and attack the defences.',
      },
    },
  },
  mariage: {
    dashboard: {
      src: '/projects/mariage-dashboard.webp',
      width: 1800,
      height: 1125,
      alt: {
        fr: 'Le tableau de bord : le compte à rebours sur sa carte encre, les invités prévus, le coût estimé, les réponses, la répartition du budget et les tâches à faire.',
        en: 'The dashboard: the countdown on its ink card, expected guests, estimated cost, replies, budget split and tasks to do.',
      },
    },
    plan: {
      src: '/projects/mariage-plan.webp',
      width: 1800,
      height: 1125,
      alt: {
        fr: 'Le plan de table : les foyers à placer à gauche, une table d’honneur rectangulaire et des tables rondes, avec le placement automatique.',
        en: 'The seating plan: households to seat on the left, a rectangular top table and round tables, with automatic placement.',
      },
    },
    scenarios: {
      src: '/projects/mariage-scenarios.webp',
      width: 1800,
      height: 1125,
      alt: {
        fr: 'Les scénarios : on fait varier le nombre d’invités et le coût total se recalcule poste par poste.',
        en: 'Scenarios: change the guest count and the total cost is recalculated line by line.',
      },
    },
    rsvp: {
      src: '/projects/mariage-rsvp.webp',
      width: 780,
      height: 1688,
      alt: {
        fr: 'La page qu’ouvre un foyer avec son lien, sur téléphone : l’invitation de Camille & Alex, la date, le lieu, puis « Qui sera présent ? ».',
        en: 'The page a household opens from its link, on a phone: Camille & Alex’s invitation, date and venue, then “Who will be there?”.',
      },
    },
  },
  noel: {
    home: {
      src: '/projects/noel-home.webp',
      width: 1800,
      height: 1125,
      alt: {
        fr: 'L’accueil du Noël des copains : « Qui offre à qui ? », et le formulaire pour préparer l’échange.',
        en: 'The Noël des copains home page: “Who gives to whom?”, and the form to set up the exchange.',
      },
    },
    wheel: {
      src: '/projects/noel-wheel.webp',
      width: 780,
      height: 1688,
      alt: {
        fr: 'La page secrète de Lucie : une roue avec les prénoms des autres participants, et le bouton « Faire tourner la roue ».',
        en: 'Lucie’s secret page: a wheel with the other participants’ names, and a “Spin the wheel” button.',
      },
    },
    tag: {
      src: '/projects/noel-tag.webp',
      width: 780,
      height: 1688,
      alt: {
        fr: 'Après le tour de roue : une étiquette « Pour Paul, de la part de Lucie », et la liste d’envies de Paul.',
        en: 'After the spin: a gift tag “For Paul, from Lucie”, and Paul’s wish list.',
      },
    },
  },
} satisfies Record<SceneId, Record<string, Shot>>

export interface Step {
  start: number // decimal year
  end: number | null // null = today
  period: Localized
  title: Localized
  place: string
  text: Localized
  stack?: string
  kind: 'work' | 'school'
}

export const career: Step[] = [
  {
    start: 2018.1,
    end: null,
    period: { fr: 'Depuis 2018', en: 'Since 2018' },
    title: { fr: 'Développeur web', en: 'Web developer' },
    place: 'CICD',
    text: {
      fr: 'Applications web de comptabilité pour des groupes pétroliers.',
      en: 'Accounting web applications for oil groups.',
    },
    stack: 'Laravel · Vue · Nuxt · API REST · Docker',
    kind: 'work',
  },
  {
    start: 2017.5,
    end: 2018.1,
    period: { fr: '2017 – 2018', en: '2017 – 2018' },
    title: { fr: 'Développeur web', en: 'Web developer' },
    place: 'NCI',
    text: {
      fr: 'Interfaces clientes pour des applications de transport et de logistique.',
      en: 'Client interfaces for transport and logistics applications.',
    },
    stack: 'Vue · DataSnap · API REST',
    kind: 'work',
  },
  {
    start: 2015,
    end: 2017.5,
    period: { fr: '2015 – 2017', en: '2015 – 2017' },
    title: { fr: 'Développeur web', en: 'Web developer' },
    place: 'Web Interactive',
    text: {
      fr: 'Site e-commerce d’une pharmacie en ligne.',
      en: 'E-commerce site for an online pharmacy.',
    },
    stack: 'Laravel · Blade · jQuery',
    kind: 'work',
  },
  {
    start: 2013.7,
    end: 2014.5,
    period: { fr: '2013 – 2014', en: '2013 – 2014' },
    title: { fr: 'Licence pro ATC Webmestre', en: 'Professional degree, webmaster' },
    place: 'Université de Caen',
    text: {
      fr: 'Activités et techniques de communication.',
      en: 'Communication activities and techniques.',
    },
    kind: 'school',
  },
  {
    start: 2011.7,
    end: 2013.5,
    period: { fr: '2011 – 2013', en: '2011 – 2013' },
    title: { fr: 'DUT Informatique', en: 'Computer science diploma (DUT)' },
    place: 'IUT de Caen',
    text: { fr: 'Option génie logiciel.', en: 'Software engineering track.' },
    kind: 'school',
  },
]

export const skills: { group: Localized; items: string[] }[] = [
  {
    group: { fr: 'Front', en: 'Front end' },
    items: ['Vue 3', 'Nuxt', 'TypeScript', 'Tailwind CSS', 'Vuetify', 'PrimeVue', 'Sass', 'three.js', 'GSAP'],
  },
  {
    group: { fr: 'Back', en: 'Back end' },
    items: ['Laravel', 'PHP', 'Express', 'Inertia', 'MySQL', 'PostgreSQL', 'Firebase'],
  },
  {
    group: { fr: 'Mobile', en: 'Mobile' },
    items: ['PWA', 'Capacitor', 'React Native'],
  },
  {
    group: { fr: 'DevOps', en: 'DevOps' },
    items: ['Docker', 'CI/CD', 'Git flow'],
  },
  {
    group: { fr: 'Et autour', en: 'And around it' },
    items: ['Claude Code', 'UML / Merise', 'Photoshop', 'Illustrator'],
  },
]

/** What I can take on for a client. Grounded in the projects above. */
export const services: { title: Localized; text: Localized; proof: Localized }[] = [
  {
    title: { fr: 'Sites et réservation en ligne', en: 'Websites and online booking' },
    text: {
      fr: 'Un site rapide et bien référencé, avec un vrai parcours de réservation ou de commande : prix calculé, paiement, comptes clients.',
      en: 'A fast, search-friendly site with a real booking or ordering flow: calculated prices, payment, customer accounts.',
    },
    proof: { fr: 'Comme Move Taxi Moto', en: 'Like Move Taxi Moto' },
  },
  {
    title: { fr: 'Back-offices et outils métier', en: 'Back offices and business tools' },
    text: {
      fr: 'L’outil interne qui remplace le tableur : suivi des commandes, plannings, clients, exports. Pensé pour ceux qui l’utilisent tous les jours.',
      en: 'The in-house tool that replaces the spreadsheet: orders, schedules, customers, exports. Built for the people who use it every day.',
    },
    proof: { fr: 'Mon quotidien chez CICD depuis 2018', en: 'My day job at CICD since 2018' },
  },
  {
    title: { fr: 'Applis installables et mobiles', en: 'Installable and mobile apps' },
    text: {
      fr: 'Une appli web qui s’installe sur le téléphone et marche hors ligne, ou une vraie appli Android quand il le faut.',
      en: 'A web app that installs on a phone and works offline, or a native Android app when it calls for one.',
    },
    proof: { fr: 'Comme Mariage et Kaplouf', en: 'Like Mariage and Kaplouf' },
  },
]

/** How a freelance project goes, in order. */
export const process: { title: Localized; text: Localized }[] = [
  {
    title: { fr: 'On en parle', en: 'We talk' },
    text: { fr: 'Votre besoin, vos utilisateurs, votre budget. Je vous dis franchement ce qui est réaliste.', en: 'Your needs, your users, your budget. I tell you honestly what is realistic.' },
  },
  {
    title: { fr: 'Je prototype', en: 'I prototype' },
    text: { fr: 'Une maquette cliquable, pour valider le parcours avant d’écrire la moindre ligne de production.', en: 'A clickable mock-up, to validate the flow before writing any production code.' },
  },
  {
    title: { fr: 'Je développe', en: 'I build' },
    text: { fr: 'Par étapes, avec une version en ligne à tester à chaque fois.', en: 'Step by step, with a live version to try at each one.' },
  },
  {
    title: { fr: 'On met en ligne', en: 'We launch' },
    text: { fr: 'Mise en production, puis suivi et évolutions si vous le souhaitez.', en: 'Go-live, then maintenance and new features if you want them.' },
  },
]


/** The work done for employers, shown under the projects. Builds on `career`, adding what it was about. */
export const companyWork: Record<string, { field: Localized; text: Localized; art: 'ledger' | 'routes' | 'shop' }> = {
  CICD: {
    field: { fr: 'Comptabilité · groupes pétroliers', en: 'Accounting · oil groups' },
    text: {
      fr: 'Des applications web de comptabilité pour des groupes pétroliers, mon quotidien depuis 2018 : du back-end Laravel aux interfaces Vue et Nuxt, des API REST au déploiement sous Docker.',
      en: 'Accounting web applications for oil groups, my day job since 2018: from the Laravel back end to the Vue and Nuxt interfaces, from REST APIs to Docker deployments.',
    },
    art: 'ledger',
  },
  NCI: {
    field: { fr: 'Transport · logistique', en: 'Transport · logistics' },
    text: {
      fr: 'Les interfaces clientes d’applications de transport et de logistique, en Vue, branchées sur des API REST et des serveurs DataSnap.',
      en: 'The client interfaces of transport and logistics applications, in Vue, wired to REST APIs and DataSnap servers.',
    },
    art: 'routes',
  },
  'Web Interactive': {
    field: { fr: 'E-commerce · santé', en: 'E-commerce · health' },
    text: {
      fr: 'Le site e-commerce d’une pharmacie en ligne, en Laravel, Blade et jQuery : mes premières années de métier.',
      en: 'The e-commerce site of an online pharmacy, in Laravel, Blade and jQuery: my first years on the job.',
    },
    art: 'shop',
  },
}
