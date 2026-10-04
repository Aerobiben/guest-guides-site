function airbnbPhoto(path) {
  return `https://a0.muscache.com/im/pictures/${path}?im_w=1200`;
}

const AIRBNB = {
  sunset: {
    listing: "https://www.airbnb.com/rooms/3079929",
    living: airbnbPhoto("airflow/Hosting-3079929/original/67bf0f10-3eac-4356-8857-fdbb61012dab.jpg"),
    kitchen: airbnbPhoto("airflow/Hosting-3079929/original/350d217a-d79c-4ac6-aeab-32d3badb21dc.jpg"),
    bedroom: airbnbPhoto("airflow/Hosting-3079929/original/e090dbdc-a311-424f-9b0a-f6bd191599b3.jpg"),
    garden: airbnbPhoto("airflow/Hosting-3079929/original/7581a943-8516-4328-b2d8-fbc1cfda6a3a.jpg"),
  },
  lisbon: {
    listing: "https://www.airbnb.com/rooms/495237",
    living: airbnbPhoto("miso/Hosting-495237/original/c7d872aa-c20e-4271-a003-507273a3ef0c.jpeg"),
    terrace: airbnbPhoto("miso/Hosting-495237/original/d4473fcd-b464-484b-a9ac-1339c6d3f378.jpeg"),
    kitchen: airbnbPhoto("miso/Hosting-495237/original/5f4b1022-de4c-44eb-a27e-a12bfde3ec7f.jpeg"),
    breakfast: airbnbPhoto("miso/Hosting-495237/original/f481f6b4-a1de-4c32-ac7b-9c2adfe02ea5.jpeg"),
  },
  tokyo: {
    listing: "https://www.airbnb.com/rooms/6719865",
    tatami: airbnbPhoto("106035557/bf134f9c_original.jpg"),
    garden: airbnbPhoto("106034715/58e1f3b7_original.jpg"),
    dining: airbnbPhoto("106034680/13c1ec22_original.jpg"),
    futon: airbnbPhoto("hosting/Hosting-6719865/original/23714b1f-097a-422b-847f-d4eecfab6eac.jpeg"),
  },
  roma: {
    listing: "https://www.airbnb.com/rooms/953052904610923157",
    loft: airbnbPhoto("airflow/Hosting-953052904610923157/original/06f064ff-3b10-4a2d-b6c6-02c8bde04a6c.jpg"),
    kitchen: airbnbPhoto("airflow/Hosting-953052904610923157/original/4752b58b-3690-41c3-a503-f0ff290303a4.jpg"),
    bedroom: airbnbPhoto("airflow/Hosting-953052904610923157/original/9834c2d1-96bf-4ef7-86e8-0d554921cf14.jpg"),
    terrace: airbnbPhoto("airflow/Hosting-953052904610923157/original/27692c9b-f207-4ee3-9552-a12e4a2d6402.jpg"),
  },
  mundus: {
    listing: "https://www.airbnb.com/rooms/738225000657298753",
    terrace: airbnbPhoto("hosting/Hosting-738225000657298753/original/314b8300-6d12-4c3c-b207-f242ffa0600b.jpeg"),
    living: airbnbPhoto("hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NzM4MjI1MDAwNjU3Mjk4NzUz/original/1be81420-2f75-4faf-a648-88927f74c880.jpeg"),
    loft: airbnbPhoto("hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NzM4MjI1MDAwNjU3Mjk4NzUz/original/181d5c19-e6b2-4bdb-8946-84b6c24857c1.jpeg"),
    mezzanine: airbnbPhoto("hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NzM4MjI1MDAwNjU3Mjk4NzUz/original/7368e407-8e47-4114-a768-2d79e80a2348.jpeg"),
  },
  lilas: {
    listing: "https://www.airbnb.com/rooms/20794994",
    living: airbnbPhoto("79198232-7884-4356-9cc8-71d0c17f4c55.jpg"),
    column: airbnbPhoto("c08bb59a-4f84-486c-9110-eeb0db08f6e3.jpg"),
    plants: airbnbPhoto("684df33c-48a4-403e-ac0a-aa3aeebaba6f.jpg"),
    salon: airbnbPhoto("81da2f6c-33ae-4f17-a9bf-491aaead2400.jpg"),
  },
  glasgow: {
    listing: "https://www.airbnb.com/rooms/1370329958509772935",
    living: airbnbPhoto("prohost-api/Hosting-1370329958509772935/original/914077fa-3c00-43ae-a353-e2fe2a0c7d49.jpeg"),
    lounge: airbnbPhoto("prohost-api/Hosting-1370329958509772935/original/97c4ef6a-cd50-4ce5-a961-66e77df572d0.jpeg"),
    open: airbnbPhoto("prohost-api/Hosting-1370329958509772935/original/c2868095-b05f-40cd-a365-046e0560028d.jpeg"),
    kitchen: airbnbPhoto("prohost-api/Hosting-1370329958509772935/original/bb99d8ab-9a03-480f-9c8d-2e8f32a802a0.jpeg"),
  },
};

function makeId(prefix = "gb") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function fieldId(value, fallback) {
  const clean = String(value ?? "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
  return clean || fallback;
}

function normalizeGuidebook(raw = {}, index = 0) {
  const base = blankGuidebook();
  const source = raw && typeof raw === "object" ? raw : {};
  const guide = {
    ...base,
    title: String(source.title ?? base.title),
    propertyName: String(source.propertyName ?? base.propertyName),
    hostName: String(source.hostName ?? base.hostName),
    hostPhone: String(source.hostPhone ?? base.hostPhone),
    hostEmail: String(source.hostEmail ?? base.hostEmail),
    listingUrl: String(source.listingUrl ?? base.listingUrl),
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
          id: fieldId(photo?.id, `ph-${index}-${i}`),
          url: String(photo?.url || ""),
          caption: String(photo?.caption || ""),
        }))
      : base.photos,
    houseManual: Array.isArray(source.houseManual)
      ? source.houseManual.map((item, i) => ({
          id: fieldId(item?.id, `hm-${index}-${i}`),
          title: String(item?.title || ""),
          body: String(item?.body || ""),
        }))
      : [],
    houseRules: Array.isArray(source.houseRules)
      ? source.houseRules.map((rule) => String(rule ?? "")).filter(Boolean)
      : [],
    recommendations: Array.isArray(source.recommendations)
      ? source.recommendations.map((item, i) => ({
          id: fieldId(item?.id, `rec-${index}-${i}`),
          name: String(item?.name || ""),
          category: String(item?.category || ""),
          notes: String(item?.notes || ""),
          url: String(item?.url || ""),
          image: String(item?.image || ""),
        }))
      : [],
  };
  guide.theme = source.theme === "dark" || source.theme === "light" ? source.theme : "auto";
  guide.id = fieldId(source.id, guide.id);
  guide.demo = source.demo === true;
  guide.fromSample = source.fromSample === true
    || (source.fromSample !== false && isSampleListing(guide.listingUrl));
  return guide;
}

function isSampleListing(url) {
  const raw = String(url || "").trim();
  return Object.values(AIRBNB).some((item) => item.listing === raw);
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
    demo: false,
    fromSample: false,
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
    listingUrl: AIRBNB.sunset.listing,
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
      { id: "ph-1", url: AIRBNB.sunset.living, caption: "Living room" },
      { id: "ph-2", url: AIRBNB.sunset.kitchen, caption: "Kitchen" },
      { id: "ph-3", url: AIRBNB.sunset.bedroom, caption: "Bedroom" },
      { id: "ph-4", url: AIRBNB.sunset.garden, caption: "Garden bedroom" },
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
        image: AIRBNB.sunset.kitchen,
      },
      {
        id: "rec-2",
        name: "Ocean Beach",
        category: "Walk",
        notes: "Head west on Judah until you hit sand. Sunset is the whole point.",
        url: "https://maps.google.com/?q=Ocean+Beach+San+Francisco",
        image: AIRBNB.sunset.garden,
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
    listingUrl: AIRBNB.mundus.listing,
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
      { id: "ph-m1", url: AIRBNB.mundus.terrace, caption: "Terrace jacuzzi" },
      { id: "ph-m2", url: AIRBNB.mundus.living, caption: "Living kitchen" },
      { id: "ph-m3", url: AIRBNB.mundus.loft, caption: "Loft bedroom" },
      { id: "ph-m4", url: AIRBNB.mundus.mezzanine, caption: "Mezzanine" },
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
        image: AIRBNB.mundus.living,
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
    listingUrl: AIRBNB.lilas.listing,
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
      { id: "ph-l1", url: AIRBNB.lilas.living, caption: "Living room, Bastille view" },
      { id: "ph-l2", url: AIRBNB.lilas.column, caption: "Window on the column" },
      { id: "ph-l3", url: AIRBNB.lilas.plants, caption: "Salon" },
      { id: "ph-l4", url: AIRBNB.lilas.salon, caption: "Fireplace room" },
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
        image: AIRBNB.lilas.plants,
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
    listingUrl: AIRBNB.glasgow.listing,
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
      { id: "ph-g1", url: AIRBNB.glasgow.living, caption: "Bay living room" },
      { id: "ph-g2", url: AIRBNB.glasgow.lounge, caption: "Lounge" },
      { id: "ph-g3", url: AIRBNB.glasgow.open, caption: "Open kitchen" },
      { id: "ph-g4", url: AIRBNB.glasgow.kitchen, caption: "Kitchen" },
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
        image: AIRBNB.glasgow.living,
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
    listingUrl: AIRBNB.lisbon.listing,
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
      { id: "ph-lx1", url: AIRBNB.lisbon.living, caption: "Sitting room" },
      { id: "ph-lx2", url: AIRBNB.lisbon.terrace, caption: "Terrace" },
      { id: "ph-lx3", url: AIRBNB.lisbon.kitchen, caption: "Kitchen" },
      { id: "ph-lx4", url: AIRBNB.lisbon.breakfast, caption: "Breakfast table" },
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
        image: AIRBNB.lisbon.terrace,
      },
      {
        id: "rec-lx2",
        name: "Fábrica Coffee Roasters",
        category: "Coffee",
        notes: "A downhill walk toward Chiado. Filter coffee is better than the espresso here.",
        url: "https://maps.google.com/?q=F%C3%A1brica+Coffee+Roasters+Lisbon",
        image: AIRBNB.lisbon.breakfast,
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
    listingUrl: AIRBNB.tokyo.listing,
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
      { id: "ph-ty1", url: AIRBNB.tokyo.tatami, caption: "Tatami room" },
      { id: "ph-ty2", url: AIRBNB.tokyo.garden, caption: "Garden sitting room" },
      { id: "ph-ty3", url: AIRBNB.tokyo.dining, caption: "Dining and shoji" },
      { id: "ph-ty4", url: AIRBNB.tokyo.futon, caption: "Futon room" },
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
        image: AIRBNB.tokyo.garden,
      },
      {
        id: "rec-ty2",
        name: "Kayaba Coffee",
        category: "Coffee",
        notes: "Kissaten two streets over. Morning blend and thick toast.",
        url: "https://maps.google.com/?q=Kayaba+Coffee+Yanaka",
        image: AIRBNB.tokyo.dining,
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
    listingUrl: AIRBNB.roma.listing,
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
      { id: "ph-mx1", url: AIRBNB.roma.loft, caption: "Loft living room" },
      { id: "ph-mx2", url: AIRBNB.roma.kitchen, caption: "Kitchen" },
      { id: "ph-mx3", url: AIRBNB.roma.bedroom, caption: "Loft bedroom" },
      { id: "ph-mx4", url: AIRBNB.roma.terrace, caption: "Private terrace" },
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
        image: AIRBNB.roma.terrace,
      },
      {
        id: "rec-mx2",
        name: "El Turix",
        category: "Tacos",
        notes: "Cochinita on a paper plate. Go early; they sell out.",
        url: "https://maps.google.com/?q=El+Turix+Roma+Norte",
        image: AIRBNB.roma.kitchen,
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
].map((guide) => ({ ...guide, demo: true, fromSample: false }));

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
globalThis.isSampleListing = isSampleListing;
globalThis.makeId = makeId;
globalThis.sunsetGuidebook = sunsetGuidebook;
globalThis.lisbonGuidebook = lisbonGuidebook;
globalThis.tokyoGuidebook = tokyoGuidebook;
globalThis.romaNorteGuidebook = romaNorteGuidebook;
globalThis.mundusGuidebook = mundusGuidebook;
globalThis.lesLilasGuidebook = lesLilasGuidebook;
globalThis.glasgowGuidebook = glasgowGuidebook;
