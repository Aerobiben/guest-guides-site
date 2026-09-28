const DEFAULT_PHOTOS = {
  hero: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=960&q=75",
  living: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=75",
  kitchen: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=800&q=75",
  bedroom: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=75",
  cafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=720&q=75",
  hike: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=720&q=75",
  bologna: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=960&q=75",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=960&q=75",
  glasgow: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=960&q=75",
  fog: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=960&q=75",
  lisbon: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=960&q=75",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=960&q=75",
  cdmx: "https://images.unsplash.com/photo-1518659526051-707ba0fd610c?auto=format&fit=crop&w=960&q=75",
  tram: "https://images.unsplash.com/photo-1528702748617-c82ea3ce87cd?auto=format&fit=crop&w=720&q=75",
  lantern: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=720&q=75",
  taco: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=720&q=75",
};

function makeId(prefix = "gb") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeGuidebook(raw = {}, index = 0) {
  const base = blankGuidebook();
  const source = raw && typeof raw === "object" ? raw : {};
  const guide = {
    ...base,
    ...source,
    intro: { ...base.intro, ...(source.intro || {}) },
    address: { ...base.address, ...(source.address || {}) },
    wifi: { ...base.wifi, ...(source.wifi || {}) },
    checkIn: { ...base.checkIn, ...(source.checkIn || {}) },
    checkOut: { ...base.checkOut, ...(source.checkOut || {}) },
    parking: { ...base.parking, ...(source.parking || {}) },
    directions: { ...base.directions, ...(source.directions || {}) },
    bookAgain: { ...base.bookAgain, ...(source.bookAgain || {}) },
    emergency: { ...base.emergency, ...(source.emergency || {}) },
    photos: Array.isArray(source.photos) && source.photos.length
      ? source.photos.map((photo, i) => ({
          id: photo?.id || `ph-${index}-${i}`,
          url: photo?.url || "",
          caption: photo?.caption || "",
        }))
      : base.photos,
    houseManual: Array.isArray(source.houseManual)
      ? source.houseManual.map((item, i) => ({
          id: item?.id || `hm-${index}-${i}`,
          title: item?.title || "",
          body: item?.body || "",
        }))
      : [],
    houseRules: Array.isArray(source.houseRules) ? source.houseRules : [],
    recommendations: Array.isArray(source.recommendations)
      ? source.recommendations.map((item, i) => ({
          id: item?.id || `rec-${index}-${i}`,
          name: item?.name || "",
          category: item?.category || "",
          notes: item?.notes || "",
          url: item?.url || "",
          image: item?.image || "",
        }))
      : [],
  };
  if (source.id) guide.id = source.id;
  return guide;
}

function blankGuidebook() {
  return {
    id: makeId(),
    title: "New guidebook",
    theme: "auto",
    propertyName: "",
    hostName: "",
    hostPhone: "",
    hostEmail: "",
    listingUrl: "",
    intro: {
      welcome: "",
      about: "",
    },
    address: {
      search: "",
      line1: "",
      streetNumber: "",
      streetName: "",
      city: "",
      state: "",
      postal: "",
      country: "",
      lat: "",
      lng: "",
      linkBehavior: "automatic",
    },
    photos: [
      { id: makeId("ph"), url: "", caption: "Hero" },
    ],
    wifi: {
      network: "",
      password: "",
      notes: "",
    },
    checkIn: {
      time: "15:00",
      accessCode: "",
      instructions: "",
    },
    checkOut: {
      time: "11:00",
      instructions: "",
    },
    parking: {
      notes: "",
    },
    directions: {
      notes: "",
    },
    houseManual: [],
    houseRules: [],
    recommendations: [],
    bookAgain: {
      message: "We would love to host you again.",
    },
    emergency: {
      localNumber: "911",
      notes: "",
    },
  };
}

function sunsetGuidebook() {
  return {
    id: "gb-sunset",
    title: "Sunset Garden Studio",
    theme: "auto",
    propertyName: "Sunset Garden Studio",
    hostName: "Maya",
    hostPhone: "+1 (415) 555-0100",
    hostEmail: "maya.host@example.com",
    listingUrl: "https://www.airbnb.com/",
    intro: {
      welcome: "Welcome to the Outer Sunset. The studio opens onto a small garden, two blocks from the N-Judah and a short walk to Ocean Beach.",
      about: "A one-room stay with a real kitchen, blackout blinds, and a heater that actually works in the fog.",
    },
    address: {
      search: "Outer Sunset, San Francisco, CA",
      line1: "Outer Sunset, San Francisco, CA",
      streetNumber: "",
      streetName: "",
      city: "San Francisco",
      state: "California",
      postal: "94122",
      country: "United States",
      lat: "37.7601",
      lng: "-122.5050",
      linkBehavior: "automatic",
    },
    photos: [
      { id: "ph-1", url: DEFAULT_PHOTOS.hero, caption: "Living room" },
      { id: "ph-2", url: DEFAULT_PHOTOS.living, caption: "Sofa nook" },
      { id: "ph-3", url: DEFAULT_PHOTOS.kitchen, caption: "Kitchen" },
      { id: "ph-4", url: DEFAULT_PHOTOS.fog, caption: "Ocean Beach" },
    ],
    wifi: {
      network: "SunsetGuest",
      password: "oceanview",
      notes: "The router is on the shelf by the TV. 5 GHz is faster if your phone sees both.",
    },
    checkIn: {
      time: "15:00",
      accessCode: "1024#",
      instructions: "Use the keypad on the garden gate, then the lockbox under the bench by the studio door. Code is 1024#.",
    },
    checkOut: {
      time: "11:00",
      instructions: "Leave keys in the lockbox, start the dishwasher if you used it, and set the heat to 18°C / 64°F.",
    },
    parking: {
      notes: "Street parking is usually easy west of 46th Avenue. Watch Tuesday street sweeping, 8–10am.",
    },
    directions: {
      notes: "From SFO, BART to Civic Center, then the N-Judah toward Ocean Beach. Get off at Judah & 46th. Rideshare drop-off is on Judah.",
    },
    houseManual: [
      { id: "hm-1", title: "Heat & lights", body: "Thermostat is by the front door. The floor lamp is on a smart plug named Studio Lamp." },
      { id: "hm-2", title: "Trash", body: "Kitchen bags go in the black cart in the side yard. Recycling is the blue lid." },
      { id: "hm-3", title: "Coffee", body: "Beans are in the tin marked Guest. Pour-over and kettle live next to the stove." },
    ],
    houseRules: [
      "Quiet hours 10pm–8am",
      "No smoking or vaping indoors",
      "No parties or extra overnight guests without a note",
      "Please keep the garden gate latched",
    ],
    recommendations: [
      {
        id: "rec-1",
        name: "Andytown Coffee",
        category: "Coffee",
        notes: "Snowy Plovers and a window seat. A 12-minute walk toward the beach.",
        url: "https://maps.google.com/?q=Andytown+Coffee+San+Francisco",
        image: DEFAULT_PHOTOS.cafe,
      },
      {
        id: "rec-2",
        name: "Ocean Beach",
        category: "Walk",
        notes: "Head west on Judah until you hit sand. Sunset is the whole point.",
        url: "https://maps.google.com/?q=Ocean+Beach+San+Francisco",
        image: DEFAULT_PHOTOS.fog,
      },
    ],
    bookAgain: {
      message: "If you want the same studio next time, book from this link so the calendar stays in sync.",
    },
    emergency: {
      localNumber: "911",
      notes: "Nearest ER is UCSF at Parnassus, about 15 minutes by car.",
    },
  };
}

function mundusGuidebook() {
  const gb = blankGuidebook();
  return {
    ...gb,
    id: "gb-mundus",
    title: "Mundus Bologna",
    propertyName: "Mundus Bologna",
    hostName: "Mundus Hosts",
    hostPhone: "+39 051 000 0000",
    listingUrl: "https://www.airbnb.com/",
    intro: {
      welcome: "Benvenuti a Bologna. The apartment is in the university quarter, a short walk from Piazza Maggiore.",
      about: "A bright two-room stay with a full kitchen, fast Wi‑Fi, and a coffee bar on the ground floor.",
    },
    address: {
      search: "Bologna, Italy",
      line1: "Bologna, Italy",
      streetNumber: "",
      streetName: "",
      city: "Bologna",
      state: "Emilia-Romagna",
      postal: "40126",
      country: "Italy",
      lat: "44.4949",
      lng: "11.3426",
      linkBehavior: "automatic",
    },
    photos: [
      { id: "ph-m1", url: DEFAULT_PHOTOS.bologna, caption: "Bologna rooftops" },
      { id: "ph-m2", url: DEFAULT_PHOTOS.living, caption: "Apartment" },
    ],
    wifi: { network: "MundusGuest", password: "portici2026", notes: "Modem is in the cupboard near the entry." },
    checkIn: { time: "15:00", accessCode: "2288", instructions: "Ring Mundus at the street door, then take the elevator to the 3rd floor." },
    checkOut: { time: "10:00", instructions: "Leave keys on the kitchen table and close the shutters." },
    parking: { notes: "ZTL zone — do not drive in. Use the Stadium parking and walk or taxi." },
    directions: { notes: "From Bologna Centrale, bus 32 or a 15-minute walk under the portici." },
    houseManual: [{ id: "hm-m1", title: "AC", body: "Remote is in the nightstand. Set to 24°C overnight." }],
    houseRules: ["No smoking", "Quiet after 23:00"],
    recommendations: [
      {
        id: "rec-m1",
        name: "Cremeria Santo Stefano",
        category: "Gelato",
        notes: "Pistachio is the move.",
        url: "https://maps.google.com/?q=Cremeria+Santo+Stefano+Bologna",
        image: DEFAULT_PHOTOS.cafe,
      },
    ],
    bookAgain: { message: "Ask us for a returning-guest rate before you book elsewhere." },
    emergency: { localNumber: "112", notes: "Pronto soccorso at Ospedale Maggiore." },
  };
}

function lesLilasGuidebook() {
  const gb = blankGuidebook();
  return {
    ...gb,
    id: "gb-lilas",
    title: "Les Lilas",
    propertyName: "Les Lilas",
    hostName: "Camille",
    hostPhone: "+33 6 00 00 00 00",
    intro: {
      welcome: "Bienvenue. The apartment is on a quiet street near the métro, with bakeries on every corner.",
      about: "A classic Parisian one-bedroom with a courtyard view.",
    },
    address: {
      search: "Les Lilas, France",
      line1: "Les Lilas, France",
      city: "Les Lilas",
      state: "Île-de-France",
      postal: "93260",
      country: "France",
      lat: "48.881",
      lng: "2.418",
      linkBehavior: "automatic",
    },
    photos: [
      { id: "ph-l1", url: DEFAULT_PHOTOS.paris, caption: "Paris from the window" },
      { id: "ph-l2", url: DEFAULT_PHOTOS.living, caption: "Courtyard apartment" },
    ],
    wifi: { network: "LilasFibre", password: "courtyard", notes: "Box is behind the TV. 5 GHz is LilasFibre-5." },
    checkIn: { time: "16:00", accessCode: "A 1204", instructions: "Building code on the left keypad. Apartment is 3ème gauche." },
    checkOut: { time: "11:00", instructions: "Leave keys in the bowl by the door." },
    parking: { notes: "Resident-only street parking. Use the parking at Porte des Lilas." },
    directions: { notes: "Métro line 11, station Porte des Lilas. From CDG, RER B to Châtelet then line 11." },
    houseManual: [{ id: "hm-l1", title: "Shutters", body: "Pull the cord slowly — they stick if you yank. Close them before you leave." }],
    houseRules: ["No smoking", "Take shoes off at the door"],
    recommendations: [
      {
        id: "rec-l1",
        name: "Du Pain et des Idées",
        category: "Bakery",
        notes: "Pistachio escargot if they still have it after 10am. Walk or take line 11 to République, then 15 minutes on foot.",
        url: "https://maps.google.com/?q=Du+Pain+et+des+Id%C3%A9es+Paris",
        image: DEFAULT_PHOTOS.cafe,
      },
    ],
    bookAgain: { message: "Write us first — we keep a few dates for returning guests." },
    emergency: { localNumber: "112", notes: "" },
  };
}

function glasgowGuidebook() {
  const gb = blankGuidebook();
  return {
    ...gb,
    id: "gb-glasgow",
    title: "BnBHost Glasgow",
    propertyName: "West End Flat",
    hostName: "BnBHost",
    hostPhone: "+44 141 000 0000",
    intro: {
      welcome: "Welcome to the West End. You are a short walk from Kelvingrove and Byres Road.",
      about: "A warm top-floor flat with blackout blinds and a proper kettle.",
    },
    address: {
      search: "Glasgow West End",
      line1: "Glasgow, United Kingdom",
      city: "Glasgow",
      state: "Scotland",
      postal: "G12",
      country: "United Kingdom",
      lat: "55.874",
      lng: "-4.292",
      linkBehavior: "automatic",
    },
    photos: [
      { id: "ph-g1", url: DEFAULT_PHOTOS.glasgow, caption: "West End streets" },
      { id: "ph-g2", url: DEFAULT_PHOTOS.living, caption: "Top-floor sitting room" },
    ],
    wifi: { network: "WestEndGuest", password: "kelvingrove", notes: "Router lives in the hall cupboard." },
    checkIn: { time: "15:00", accessCode: "1945", instructions: "Key safe is to the right of the close door, facing the street." },
    checkOut: { time: "10:30", instructions: "Leave keys in the safe and close the windows." },
    parking: { notes: "Permit zone. PayByPhone bays on the next street over." },
    directions: { notes: "From Glasgow Queen Street, subway to Hillhead. 8-minute walk from the station." },
    houseManual: [{ id: "hm-g1", title: "Heating", body: "Hive thermostat in the hall. 19°C is comfortable." }],
    houseRules: ["No smoking", "Bins out on Tuesday night"],
    recommendations: [
      {
        id: "rec-g1",
        name: "Kelvingrove Park",
        category: "Walk",
        notes: "Ten minutes downhill. Good for a first-morning coffee walk.",
        url: "https://maps.google.com/?q=Kelvingrove+Park+Glasgow",
        image: DEFAULT_PHOTOS.hike,
      },
    ],
    bookAgain: { message: "Use the listing link so we can keep your preferred dates." },
    emergency: { localNumber: "999", notes: "" },
  };
}

function lisbonGuidebook() {
  const gb = blankGuidebook();
  return {
    ...gb,
    id: "gb-lisbon",
    title: "Alfama Terrace",
    propertyName: "Alfama Terrace",
    hostName: "Inês",
    hostPhone: "+351 21 000 0000",
    hostEmail: "ines.host@example.com",
    listingUrl: "https://www.airbnb.com/",
    intro: {
      welcome: "Bem-vindos. The terrace looks over Alfama rooftops, and the 28 tram rattles two streets down.",
      about: "A compact apartment with a proper espresso machine, thick walls, and blackout curtains for late nights.",
    },
    address: {
      search: "Alfama, Lisbon, Portugal",
      line1: "Alfama, Lisbon, Portugal",
      streetNumber: "",
      streetName: "",
      city: "Lisbon",
      state: "Lisboa",
      postal: "1100",
      country: "Portugal",
      lat: "38.7129",
      lng: "-9.1329",
      linkBehavior: "automatic",
    },
    photos: [
      { id: "ph-lx1", url: DEFAULT_PHOTOS.lisbon, caption: "Alfama rooftops" },
      { id: "ph-lx2", url: DEFAULT_PHOTOS.tram, caption: "Tram 28" },
      { id: "ph-lx3", url: DEFAULT_PHOTOS.living, caption: "Sitting room" },
    ],
    wifi: { network: "AlfamaGuest", password: "azulejo", notes: "Router is on the shelf by the terrace door." },
    checkIn: { time: "15:00", accessCode: "3317", instructions: "Street door keypad, then second door on the left. Keys are in the tray on the table." },
    checkOut: { time: "11:00", instructions: "Leave keys in the tray, close the terrace door, and pull the shutters." },
    parking: { notes: "Do not drive into Alfama. Park at Santa Apolónia and walk up, or take a taxi to the square." },
    directions: { notes: "From the airport, metro to Santa Apolónia, then a 12-minute uphill walk. Taxis know “mirante de Santa Luzia”." },
    houseManual: [
      { id: "hm-lx1", title: "Terrace", body: "The door sticks in humid weather — lift slightly as you pull. Please latch it before you go out." },
      { id: "hm-lx2", title: "Coffee", body: "Beans in the tin marked Hóspedes. The espresso machine is primed; just press the cup button." },
    ],
    houseRules: ["No smoking indoors", "Quiet after 23:00 — the building is thin", "Please latch the terrace door"],
    recommendations: [
      {
        id: "rec-lx1",
        name: "Tram 28",
        category: "Ride",
        notes: "Board at Portas do Sol if you can. Sit on the right going west for the views.",
        url: "https://maps.google.com/?q=Portas+do+Sol+Lisbon",
        image: DEFAULT_PHOTOS.tram,
      },
      {
        id: "rec-lx2",
        name: "Fábrica Coffee Roasters",
        category: "Coffee",
        notes: "A downhill walk toward Chiado. Filter coffee is better than the espresso here.",
        url: "https://maps.google.com/?q=F%C3%A1brica+Coffee+Roasters+Lisbon",
        image: DEFAULT_PHOTOS.cafe,
      },
    ],
    bookAgain: { message: "Tell us the dates before you book elsewhere — we hold returning-guest weekends when we can." },
    emergency: { localNumber: "112", notes: "Hospital de São José is the nearest ER." },
  };
}

function tokyoGuidebook() {
  const gb = blankGuidebook();
  return {
    ...gb,
    id: "gb-tokyo",
    title: "Yanaka Lantern Loft",
    propertyName: "Yanaka Lantern Loft",
    hostName: "Yuki",
    hostPhone: "+81 3 0000 0000",
    hostEmail: "yuki.host@example.com",
    listingUrl: "https://www.airbnb.com/",
    intro: {
      welcome: "ようこそ. The loft sits above a quiet Yanaka street, a short walk from Nippori and the cemetery paths.",
      about: "A one-room loft with a futon that is actually comfortable, a kitchenette, and a sento two blocks away.",
    },
    address: {
      search: "Yanaka, Taito City, Tokyo",
      line1: "Yanaka, Tokyo, Japan",
      streetNumber: "",
      streetName: "",
      city: "Tokyo",
      state: "Tokyo",
      postal: "110-0001",
      country: "Japan",
      lat: "35.7281",
      lng: "139.7686",
      linkBehavior: "automatic",
    },
    photos: [
      { id: "ph-ty1", url: DEFAULT_PHOTOS.tokyo, caption: "Evening streets" },
      { id: "ph-ty2", url: DEFAULT_PHOTOS.lantern, caption: "Lantern alley" },
      { id: "ph-ty3", url: DEFAULT_PHOTOS.bedroom, caption: "Loft" },
    ],
    wifi: { network: "YanakaGuest", password: "lantern", notes: "Pocket Wi‑Fi is in the tray if the loft signal is weak." },
    checkIn: { time: "16:00", accessCode: "8841", instructions: "Keypad on the brown door under the lantern. Shoes off at the step." },
    checkOut: { time: "10:00", instructions: "Fold the futon, leave the keys in the tray, and lock from outside." },
    parking: { notes: "No car parking. Nippori Station is a 7-minute walk; bikes can lean in the alley if they do not block the path." },
    directions: { notes: "JR Yamanote to Nippori, south exit, then follow signs toward Yanaka Cemetery. The loft is the brown door with the lantern." },
    houseManual: [
      { id: "hm-ty1", title: "Futon", body: "Unfold onto the tatami after 8pm so the room stays a sitting space during the day." },
      { id: "hm-ty2", title: "Trash", body: "Burnables in the beige bag, plastics in the clear one. Put bags in the hatch by 8am collection days (Mon / Thu)." },
    ],
    houseRules: ["Shoes off at the step", "No smoking", "Quiet after 22:00"],
    recommendations: [
      {
        id: "rec-ty1",
        name: "Yanaka Cemetery",
        category: "Walk",
        notes: "Five minutes from the door. Best just after sunrise, before tour groups.",
        url: "https://maps.google.com/?q=Yanaka+Cemetery+Tokyo",
        image: DEFAULT_PHOTOS.lantern,
      },
      {
        id: "rec-ty2",
        name: "Kayaba Coffee",
        category: "Coffee",
        notes: "Kissaten two streets over. Morning blend and thick toast.",
        url: "https://maps.google.com/?q=Kayaba+Coffee+Yanaka",
        image: DEFAULT_PHOTOS.cafe,
      },
    ],
    bookAgain: { message: "Message us with dates — the loft books out around Golden Week and New Year." },
    emergency: { localNumber: "119", notes: "Ambulance is 119. Nearest clinic is on Kototoi-dori." },
  };
}

function romaNorteGuidebook() {
  const gb = blankGuidebook();
  return {
    ...gb,
    id: "gb-roma",
    title: "Roma Norte Casa",
    propertyName: "Roma Norte Casa",
    hostName: "Sofía",
    hostPhone: "+52 55 0000 0000",
    hostEmail: "sofia.host@example.com",
    listingUrl: "https://www.airbnb.com/",
    intro: {
      welcome: "Bienvenidos a Roma Norte. The casa is a first-floor flat on a tree street, a short walk to Parque México.",
      about: "A one-bedroom with a real kitchen, a roof terrace two flights up, and a doorman who knows the building.",
    },
    address: {
      search: "Roma Norte, Mexico City",
      line1: "Roma Norte, Mexico City, Mexico",
      streetNumber: "",
      streetName: "",
      city: "Mexico City",
      state: "CDMX",
      postal: "06700",
      country: "Mexico",
      lat: "19.4194",
      lng: "-99.1620",
      linkBehavior: "automatic",
    },
    photos: [
      { id: "ph-mx1", url: DEFAULT_PHOTOS.cdmx, caption: "Roma Norte" },
      { id: "ph-mx2", url: DEFAULT_PHOTOS.taco, caption: "Late tacos" },
      { id: "ph-mx3", url: DEFAULT_PHOTOS.kitchen, caption: "Kitchen" },
    ],
    wifi: { network: "RomaNorteGuest", password: "jamaica", notes: "Modem is in the hall closet. 5 GHz is RomaNorteGuest-5." },
    checkIn: { time: "15:00", accessCode: "2507", instructions: "Tell the doorman you are in 1B. Keypad on the flat door. Terrace key is on the hook." },
    checkOut: { time: "11:00", instructions: "Leave keys on the kitchen counter and tell the doorman you are heading out." },
    parking: { notes: "Street parking is tight. Use the public lot on Orizaba if you must drive; Metro Insurgentes is closer." },
    directions: { notes: "Metro line 1 to Insurgentes, then a 10-minute walk into Roma Norte. From the airport, authorized taxi or Metrobus." },
    houseManual: [
      { id: "hm-mx1", title: "Water", body: "Do not drink the tap. A garrafón is under the sink; refill at the shop on the corner." },
      { id: "hm-mx2", title: "Roof terrace", body: "Two flights up, door marked Azotea. Bring the hook key. Close the door so the pigeons stay out." },
    ],
    houseRules: ["No smoking indoors", "Quiet after 23:00", "Please do not leave food on the terrace"],
    recommendations: [
      {
        id: "rec-mx1",
        name: "Parque México",
        category: "Walk",
        notes: "Eight minutes south. Fountain, dogs, and shade in the afternoon.",
        url: "https://maps.google.com/?q=Parque+M%C3%A9xico+CDMX",
        image: DEFAULT_PHOTOS.cdmx,
      },
      {
        id: "rec-mx2",
        name: "El Turix",
        category: "Tacos",
        notes: "Cochinita on a paper plate. Go early; they sell out.",
        url: "https://maps.google.com/?q=El+Turix+Roma+Norte",
        image: DEFAULT_PHOTOS.taco,
      },
    ],
    bookAgain: { message: "Write us before you rebook — we keep a few weekends for people we already know." },
    emergency: { localNumber: "911", notes: "Hospital Ángeles Pedregal is far; closer is Hospital Español on Ejército Nacional." },
  };
}

const STARTER_TEMPLATES = [
  sunsetGuidebook(),
  lisbonGuidebook(),
  tokyoGuidebook(),
  romaNorteGuidebook(),
  mundusGuidebook(),
  lesLilasGuidebook(),
  glasgowGuidebook(),
];

const SAMPLE_SLUGS = {
  "gb-sunset": "sunset-garden-studio",
  "gb-lisbon": "alfama-terrace",
  "gb-tokyo": "yanaka-lantern-loft",
  "gb-roma": "roma-norte-casa",
  "gb-mundus": "mundus-bologna",
  "gb-lilas": "les-lilas",
  "gb-glasgow": "bnbhost-glasgow",
};

globalThis.SAMPLE_SLUGS = SAMPLE_SLUGS;
globalThis.STARTER_TEMPLATES = STARTER_TEMPLATES;
globalThis.blankGuidebook = blankGuidebook;
globalThis.normalizeGuidebook = normalizeGuidebook;
globalThis.makeId = makeId;
globalThis.sunsetGuidebook = sunsetGuidebook;
globalThis.lisbonGuidebook = lisbonGuidebook;
globalThis.tokyoGuidebook = tokyoGuidebook;
globalThis.romaNorteGuidebook = romaNorteGuidebook;
globalThis.mundusGuidebook = mundusGuidebook;
globalThis.lesLilasGuidebook = lesLilasGuidebook;
globalThis.glasgowGuidebook = glasgowGuidebook;
