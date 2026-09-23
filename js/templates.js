const DEFAULT_PHOTOS = {
  hero: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
  living: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  kitchen: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1200&q=80",
  bedroom: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
  cafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
  hike: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
  bologna: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=80",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
  glasgow: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80",
};

function makeId(prefix = "gb") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
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

function richmondGuidebook() {
  return {
    id: "gb-richmond",
    title: "Clement Street Hideaway",
    theme: "auto",
    propertyName: "Clement Street Hideaway",
    hostName: "Ben Schumacher",
    hostPhone: "+1 (415) 555-0148",
    hostEmail: "host@example.com",
    listingUrl: "https://www.airbnb.com/",
    intro: {
      welcome: "Welcome home. We are so glad you chose our little hideaway in the Inner Richmond.",
      about: "A quiet one-bedroom apartment a short walk from Golden Gate Park, bakeries on Clement, and the 1 and 38 buses into downtown.",
    },
    address: {
      search: "2nd Avenue, San Francisco, CA 94118",
      line1: "2nd Avenue, San Francisco, CA 94118",
      streetNumber: "2",
      streetName: "2nd Avenue",
      city: "San Francisco",
      state: "California",
      postal: "94118",
      country: "United States",
      lat: "37.7793",
      lng: "-122.4794",
      linkBehavior: "automatic",
    },
    photos: [
      { id: "ph-1", url: DEFAULT_PHOTOS.hero, caption: "Living room" },
      { id: "ph-2", url: DEFAULT_PHOTOS.living, caption: "Sofa nook" },
      { id: "ph-3", url: DEFAULT_PHOTOS.kitchen, caption: "Kitchen" },
      { id: "ph-4", url: DEFAULT_PHOTOS.bedroom, caption: "Bedroom" },
    ],
    wifi: {
      network: "ClementGuest",
      password: "GoldenGate2026",
      notes: "The router is on the bookshelf by the TV. 5 GHz is faster if your phone sees both.",
    },
    checkIn: {
      time: "15:00",
      accessCode: "4819#",
      instructions: "The building door is on 2nd Avenue. Enter 4819# on the keypad, then take the stairs to 2R. The apartment lockbox is under the plant to the left of the door.",
    },
    checkOut: {
      time: "11:00",
      instructions: "Leave keys in the lockbox, start the dishwasher if you used it, and drop the thermostat to 68°F. You can leave luggage in the hall closet if you have a late flight — just text us.",
    },
    parking: {
      notes: "Street parking is free on 2nd Avenue with Tuesday street sweeping 8–10am. The closest garage is California Street Garage, a 6-minute walk.",
    },
    directions: {
      notes: "From SFO, take BART to Civic Center, then the 38 Geary toward the Richmond. Get off at 6th Avenue and walk north. Rideshare drop-off is safest on Clement at 2nd.",
    },
    houseManual: [
      { id: "hm-1", title: "Heat & lights", body: "Thermostat is in the hallway. Lights are dimmable from the panel by the front door." },
      { id: "hm-2", title: "Trash", body: "Kitchen bin bags go in the blue carts in the alley. Recycling is the yellow lid." },
      { id: "hm-3", title: "Coffee", body: "Beans are in the canister marked Guest. The grinder and pour-over live next to the kettle." },
    ],
    houseRules: [
      "Quiet hours 10pm–8am",
      "No smoking or vaping indoors",
      "No parties or extra overnight guests without a note",
      "Shoes off in the bedroom, please",
    ],
    recommendations: [
      {
        id: "rec-1",
        name: "Good Luck Cafe",
        category: "Coffee",
        notes: "Best flat white on the block. Open from 7am.",
        url: "https://maps.google.com/?q=Good+Luck+Cafe+San+Francisco",
        image: DEFAULT_PHOTOS.cafe,
      },
      {
        id: "rec-2",
        name: "Golden Gate Park",
        category: "Walk",
        notes: "Enter at 6th & Fulton. Stow Lake is a 20-minute loop.",
        url: "https://maps.google.com/?q=Golden+Gate+Park",
        image: DEFAULT_PHOTOS.hike,
      },
    ],
    bookAgain: {
      message: "If you want the same apartment next time, book from this link so the calendar stays in sync.",
    },
    emergency: {
      localNumber: "911",
      notes: "Nearest ER is UCSF at Parnassus. Building manager: 415-555-0199.",
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
    photos: [{ id: "ph-l1", url: DEFAULT_PHOTOS.paris, caption: "Paris" }],
    wifi: { network: "LilasFibre", password: "courtyard", notes: "" },
    checkIn: { time: "16:00", accessCode: "A 1204", instructions: "Building code on the left keypad. Apartment is 3ème gauche." },
    checkOut: { time: "11:00", instructions: "Leave keys in the bowl by the door." },
    parking: { notes: "Resident-only street parking. Use the parking at Porte des Lilas." },
    directions: { notes: "Métro line 11, station Porte des Lilas. From CDG, RER B to Châtelet then line 11." },
    houseManual: [],
    houseRules: ["No smoking", "Take shoes off at the door"],
    recommendations: [],
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
    photos: [{ id: "ph-g1", url: DEFAULT_PHOTOS.glasgow, caption: "Glasgow" }],
    wifi: { network: "WestEndGuest", password: "kelvingrove", notes: "" },
    checkIn: { time: "15:00", accessCode: "1945", instructions: "Key safe is to the right of the close door, facing the street." },
    checkOut: { time: "10:30", instructions: "Leave keys in the safe and close the windows." },
    parking: { notes: "Permit zone. PayByPhone bays on the next street over." },
    directions: { notes: "From Glasgow Queen Street, subway to Hillhead. 8-minute walk from the station." },
    houseManual: [{ id: "hm-g1", title: "Heating", body: "Hive thermostat in the hall. 19°C is comfortable." }],
    houseRules: ["No smoking", "Bins out on Tuesday night"],
    recommendations: [],
    bookAgain: { message: "Use the listing link so we can keep your preferred dates." },
    emergency: { localNumber: "999", notes: "" },
  };
}

const STARTER_TEMPLATES = [
  richmondGuidebook(),
  mundusGuidebook(),
  lesLilasGuidebook(),
  glasgowGuidebook(),
];

const SAMPLE_SLUGS = {
  "gb-richmond": "clement-street-hideaway",
  "gb-mundus": "mundus-bologna",
  "gb-lilas": "les-lilas",
  "gb-glasgow": "bnbhost-glasgow",
};

globalThis.SAMPLE_SLUGS = SAMPLE_SLUGS;
globalThis.STARTER_TEMPLATES = STARTER_TEMPLATES;
globalThis.blankGuidebook = blankGuidebook;
globalThis.makeId = makeId;
globalThis.richmondGuidebook = richmondGuidebook;
globalThis.mundusGuidebook = mundusGuidebook;
globalThis.lesLilasGuidebook = lesLilasGuidebook;
globalThis.glasgowGuidebook = glasgowGuidebook;
