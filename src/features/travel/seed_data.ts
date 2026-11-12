
import type { Place, Trip, TripStop  } from "./types";

const timestamp = new Date().toISOString();

function makePlace(
  id: string,
  name: string,
  type: Place["type"],
  parentPlaceId?: string,
): Place {
  return {
    id,
    name,
    type,
    parentPlaceId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export const places: Place[] = [
  // Countries
  makePlace("greece", "Greece", "country"),
  makePlace("vietnam", "Vietnam", "country"),
  makePlace("laos", "Laos", "country"),
  makePlace("japan", "Japan", "country"),
  makePlace("philippines", "Philippines", "country"),

  // Greece
  makePlace("cape_sounio", "Cape Sounio", "town", "greece"),
  makePlace("elefsina", "Elefsina", "town", "greece"),
  makePlace("nafpaktos", "Nafpaktos", "town", "greece"),
  makePlace("lefkada", "Lefkada", "town", "greece"),
  makePlace("ioannina", "Ioannina", "city", "greece"),
  makePlace("meteoron", "Meteora", "region", "greece"),
  makePlace("tsagarada", "Tsagkarada", "town", "greece"),
  makePlace("delphi", "Delphi", "town", "greece"),
  makePlace("athens", "Athens", "city", "greece"),

  // Vietnam
  makePlace("hanoi", "Hanoi", "city", "vietnam"),
  makePlace("ha_giang", "Ha Giang", "region", "vietnam"),
  makePlace("sapa", "Sapa", "town", "vietnam"),
  makePlace("ninh_binh", "Ninh Binh", "city", "vietnam"),
  makePlace("phong_nha", "Phong Nha", "town", "vietnam"),
  makePlace("hue", "Hue", "city", "vietnam"),
  makePlace("hoi_an", "Hoi An", "city", "vietnam"),
  makePlace("da_nang", "Da Nang", "city", "vietnam"),
  makePlace("da_lat", "Da Lat", "city", "vietnam"),
  makePlace("mui_ne", "Mui Ne", "town", "vietnam"),
  makePlace("ho_chi_minh", "Ho Chi Minh City", "city", "vietnam"),

  // Vietnam accommodation
  makePlace("drift_hostel", "The Drift Hostel", "accommodation", "hanoi"),
  makePlace("toms_hotel", "Tom's Hotel", "accommodation", "sapa"),
  makePlace("banana_tree", "Banana Tree Hostel", "accommodation", "ninh_binh"),
  makePlace("central_backpackers", "Central Backpackers", "accommodation", "phong_nha"),
  makePlace("amy_2", "Amy 2 Hostel", "accommodation", "hue"),
  makePlace("fuse_hostel", "Fuse Hostel", "accommodation", "hoi_an"),
  makePlace("rom_casa", "Rom Casa Hostel", "accommodation", "da_nang"),
  makePlace("king_kong", "King Kong Hostel", "accommodation", "da_lat"),
  makePlace("ihome", "Ihome Hostel", "accommodation", "mui_ne"),
  makePlace("mobylette", "Mobylette Hostel", "accommodation", "ho_chi_minh"),

  // Laos
  makePlace("vientiane", "Vientiane", "city", "laos"),
  makePlace("vang_vieng", "Vang Vieng", "town", "laos"),
  makePlace("na_kout", "Na Kout", "town", "laos"),
  makePlace("luang_prabang", "Luang Prabang", "city", "laos"),
  makePlace("nong_khiaw", "Nong Khiaw", "town", "laos"),

  // Laos accommodation
  makePlace("sailomyen", "Sailomyen Cafe and Hostel", "accommodation", "vientiane"),
  makePlace("rock_hostel", "Rock Hostel", "accommodation", "vang_vieng"),
  makePlace("tao_guest_house", "Tao Guest House", "accommodation", "na_kout"),

  // Japan
  makePlace("tokyo", "Tokyo", "city", "japan"),
  makePlace("fujikawaguchiko", "Fujikawaguchiko", "town", "japan"),
  makePlace("hakone", "Hakone", "town", "japan"),
  makePlace("kyoto", "Kyoto", "city", "japan"),
  makePlace("hiroshima", "Hiroshima", "city", "japan"),
  makePlace("osaka", "Osaka", "city", "japan"),
  makePlace("kamikochi", "Kamikochi", "region", "japan"),

  // Philippines
  makePlace("manila", "Manila", "city", "philippines"),
  makePlace("port_barton", "Port Barton", "town", "philippines"),
  makePlace("el_nido", "El Nido", "town", "philippines"),
  makePlace("coron", "Coron", "town", "philippines"),
  makePlace("cebu", "Cebu", "city", "philippines"),
  makePlace("siargao", "Siargao", "region", "philippines"),
];



export const trips: Trip[] = [
  {
    id: "greece_2026",
    name: "Greece",
    startDate: "2026-06-29",
    endDate: "2026-07-20",
    homeCurrency: "ZAR",
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "vietnam_2026",
    name: "Vietnam",
    startDate: "2026-07-21",
    endDate: "2026-08-22",
    homeCurrency: "ZAR",
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "laos_2026",
    name: "Laos",
    startDate: "2026-09-18",
    endDate: "2026-10-05",
    homeCurrency: "ZAR",
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "japan_2026",
    name: "Japan",
    startDate: "2026-10-05",
    endDate: "2026-10-26",
    homeCurrency: "ZAR",
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: "philippines_2026",
    name: "Philippines",
    startDate: "2026-10-27",
    endDate: "2026-11-22",
    homeCurrency: "ZAR",
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

export const tripStops: TripStop[] = [
  // Greece
  { id: "gr_1", tripId: "greece_2026", placeId: "cape_sounio", arrivalDate: "2026-06-29", departureDate: "2026-07-01", order: 1, createdAt: timestamp, updatedAt: timestamp },
  { id: "gr_2", tripId: "greece_2026", placeId: "elefsina", arrivalDate: "2026-07-01", departureDate: "2026-07-02", order: 2, createdAt: timestamp, updatedAt: timestamp },
  { id: "gr_3", tripId: "greece_2026", placeId: "nafpaktos", arrivalDate: "2026-07-02", departureDate: "2026-07-04", order: 3, createdAt: timestamp, updatedAt: timestamp },
  { id: "gr_4", tripId: "greece_2026", placeId: "lefkada", arrivalDate: "2026-07-04", departureDate: "2026-07-08", order: 4, createdAt: timestamp, updatedAt: timestamp },
  { id: "gr_5", tripId: "greece_2026", placeId: "ioannina", arrivalDate: "2026-07-08", departureDate: "2026-07-10", order: 5, createdAt: timestamp, updatedAt: timestamp },
  { id: "gr_6", tripId: "greece_2026", placeId: "meteoron", arrivalDate: "2026-07-10", departureDate: "2026-07-12", order: 6, createdAt: timestamp, updatedAt: timestamp },
  { id: "gr_7", tripId: "greece_2026", placeId: "tsagarada", arrivalDate: "2026-07-12", departureDate: "2026-07-15", order: 7, createdAt: timestamp, updatedAt: timestamp },
  { id: "gr_8", tripId: "greece_2026", placeId: "delphi", arrivalDate: "2026-07-15", departureDate: "2026-07-17", order: 8, createdAt: timestamp, updatedAt: timestamp },
  { id: "gr_9", tripId: "greece_2026", placeId: "athens", arrivalDate: "2026-07-17", departureDate: "2026-07-20", order: 9, createdAt: timestamp, updatedAt: timestamp },

  // Vietnam
  { id: "vn_1", tripId: "vietnam_2026", placeId: "hanoi", arrivalDate: "2026-07-21", departureDate: "2026-07-25", accommodationId: "drift_hostel", order: 1, createdAt: timestamp, updatedAt: timestamp },
  { id: "vn_2", tripId: "vietnam_2026", placeId: "ha_giang", arrivalDate: "2026-07-25", departureDate: "2026-07-29", order: 2, createdAt: timestamp, updatedAt: timestamp, notes: "Ha Giang Loop with MotoVentures" },
  { id: "vn_3", tripId: "vietnam_2026", placeId: "sapa", arrivalDate: "2026-07-29", departureDate: "2026-07-31", accommodationId: "toms_hotel", order: 3, createdAt: timestamp, updatedAt: timestamp },
  { id: "vn_4", tripId: "vietnam_2026", placeId: "ninh_binh", arrivalDate: "2026-08-01", departureDate: "2026-08-04", accommodationId: "banana_tree", order: 4, createdAt: timestamp, updatedAt: timestamp },
  { id: "vn_5", tripId: "vietnam_2026", placeId: "phong_nha", arrivalDate: "2026-08-04", departureDate: "2026-08-05", accommodationId: "central_backpackers", order: 5, createdAt: timestamp, updatedAt: timestamp },
  { id: "vn_6", tripId: "vietnam_2026", placeId: "hue", arrivalDate: "2026-08-05", departureDate: "2026-08-07", accommodationId: "amy_2", order: 6, createdAt: timestamp, updatedAt: timestamp },
  { id: "vn_7", tripId: "vietnam_2026", placeId: "hoi_an", arrivalDate: "2026-08-07", departureDate: "2026-08-11", accommodationId: "fuse_hostel", order: 7, createdAt: timestamp, updatedAt: timestamp },
  { id: "vn_8", tripId: "vietnam_2026", placeId: "da_nang", arrivalDate: "2026-08-11", departureDate: "2026-08-12", accommodationId: "rom_casa", order: 8, createdAt: timestamp, updatedAt: timestamp },
  { id: "vn_9", tripId: "vietnam_2026", placeId: "da_lat", arrivalDate: "2026-08-13", departureDate: "2026-08-15", accommodationId: "king_kong", order: 9, createdAt: timestamp, updatedAt: timestamp },
  { id: "vn_10", tripId: "vietnam_2026", placeId: "mui_ne", arrivalDate: "2026-08-15", departureDate: "2026-08-17", accommodationId: "ihome", order: 10, createdAt: timestamp, updatedAt: timestamp },
  { id: "vn_11", tripId: "vietnam_2026", placeId: "ho_chi_minh", arrivalDate: "2026-08-17", departureDate: "2026-08-22", accommodationId: "mobylette", order: 11, createdAt: timestamp, updatedAt: timestamp },

  // Laos
  { id: "la_1", tripId: "laos_2026", placeId: "vientiane", arrivalDate: "2026-09-18", departureDate: "2026-09-19", accommodationId: "sailomyen", order: 1, createdAt: timestamp, updatedAt: timestamp },
  { id: "la_2", tripId: "laos_2026", placeId: "vang_vieng", arrivalDate: "2026-09-19", departureDate: "2026-09-20", accommodationId: "rock_hostel", order: 2, createdAt: timestamp, updatedAt: timestamp },
  { id: "la_3", tripId: "laos_2026", placeId: "na_kout", arrivalDate: "2026-09-20", departureDate: "2026-09-28", accommodationId: "tao_guest_house", order: 3, createdAt: timestamp, updatedAt: timestamp, notes: "Volunteering at Tao Guest House" },
  { id: "la_4", tripId: "laos_2026", placeId: "luang_prabang", arrivalDate: "2026-09-28", departureDate: "2026-09-30", order: 4, createdAt: timestamp, updatedAt: timestamp },
  { id: "la_5", tripId: "laos_2026", placeId: "nong_khiaw", arrivalDate: "2026-09-30", departureDate: "2026-10-01", order: 5, createdAt: timestamp, updatedAt: timestamp },
  { id: "la_6", tripId: "laos_2026", placeId: "vang_vieng", arrivalDate: "2026-10-01", departureDate: "2026-10-04", order: 6, createdAt: timestamp, updatedAt: timestamp },
  { id: "la_7", tripId: "laos_2026", placeId: "vientiane", arrivalDate: "2026-10-04", departureDate: "2026-10-05", order: 7, createdAt: timestamp, updatedAt: timestamp },

  // Japan
  { id: "jp_1", tripId: "japan_2026", placeId: "tokyo", arrivalDate: "2026-10-05", departureDate: "2026-10-07", order: 1, createdAt: timestamp, updatedAt: timestamp },
  { id: "jp_2", tripId: "japan_2026", placeId: "fujikawaguchiko", arrivalDate: "2026-10-07", departureDate: "2026-10-09", order: 2, createdAt: timestamp, updatedAt: timestamp },
  { id: "jp_3", tripId: "japan_2026", placeId: "hakone", arrivalDate: "2026-10-09", departureDate: "2026-10-11", order: 3, createdAt: timestamp, updatedAt: timestamp },
  { id: "jp_4", tripId: "japan_2026", placeId: "tokyo", arrivalDate: "2026-10-11", departureDate: "2026-10-15", order: 4, createdAt: timestamp, updatedAt: timestamp },
  { id: "jp_5", tripId: "japan_2026", placeId: "kyoto", arrivalDate: "2026-10-15", departureDate: "2026-10-18", order: 5, createdAt: timestamp, updatedAt: timestamp },
  { id: "jp_6", tripId: "japan_2026", placeId: "hiroshima", arrivalDate: "2026-10-18", departureDate: "2026-10-20", order: 6, createdAt: timestamp, updatedAt: timestamp },
  { id: "jp_7", tripId: "japan_2026", placeId: "osaka", arrivalDate: "2026-10-20", departureDate: "2026-10-23", order: 7, createdAt: timestamp, updatedAt: timestamp },
  { id: "jp_8", tripId: "japan_2026", placeId: "kamikochi", arrivalDate: "2026-10-23", departureDate: "2026-10-25", order: 8, createdAt: timestamp, updatedAt: timestamp },
  { id: "jp_9", tripId: "japan_2026", placeId: "tokyo", arrivalDate: "2026-10-25", departureDate: "2026-10-26", order: 9, createdAt: timestamp, updatedAt: timestamp },

  // Philippines
  { id: "ph_1", tripId: "philippines_2026", placeId: "manila", arrivalDate: "2026-10-27", departureDate: "2026-10-28", order: 1, createdAt: timestamp, updatedAt: timestamp },
  { id: "ph_2", tripId: "philippines_2026", placeId: "port_barton", arrivalDate: "2026-10-28", departureDate: "2026-10-30", order: 2, createdAt: timestamp, updatedAt: timestamp },
  { id: "ph_3", tripId: "philippines_2026", placeId: "el_nido", arrivalDate: "2026-10-30", departureDate: "2026-11-05", order: 3, createdAt: timestamp, updatedAt: timestamp },
  { id: "ph_4", tripId: "philippines_2026", placeId: "coron", arrivalDate: "2026-11-07", departureDate: "2026-11-10", order: 4, createdAt: timestamp, updatedAt: timestamp },
  { id: "ph_5", tripId: "philippines_2026", placeId: "cebu", arrivalDate: "2026-11-10", departureDate: "2026-11-11", order: 5, createdAt: timestamp, updatedAt: timestamp },
  { id: "ph_6", tripId: "philippines_2026", placeId: "siargao", arrivalDate: "2026-11-11", departureDate: "2026-11-22", order: 6, createdAt: timestamp, updatedAt: timestamp, notes: "End date provisional" },
];
