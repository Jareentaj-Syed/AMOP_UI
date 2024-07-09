// Define interfaces for TypeScript type checking
export interface City {
    id: number;
    name: string;
    zipCode: string;
    timeZone: string;
  }
  
  export interface State {
    id: number;
    name: string;
    cities: City[];
  }
  
  export interface Country {
    id: number;
    name: string;
    states: State[];
  }
  
  // The actual data in the format you provided
  const countries: Country[] = [
    {
      id: 1,
      name: "USA",
      states: [
        {
          id: 101,
          name: "California",
          cities: [
            { id: 1001, name: "Los Angeles", zipCode: "90001", timeZone: "America/Los_Angeles" },
            { id: 1002, name: "San Francisco", zipCode: "94102", timeZone: "America/Los_Angeles" },
            { id: 1003, name: "San Diego", zipCode: "92101", timeZone: "America/Los_Angeles" },
            { id: 1004, name: "San Jose", zipCode: "95101", timeZone: "America/Los_Angeles" },
            { id: 1005, name: "Sacramento", zipCode: "95814", timeZone: "America/Los_Angeles" }
          ]
        },
        {
          id: 102,
          name: "New York",
          cities: [
            { id: 1006, name: "New York City", zipCode: "10001", timeZone: "America/New_York" },
            { id: 1007, name: "Buffalo", zipCode: "14201", timeZone: "America/New_York" },
            { id: 1008, name: "Rochester", zipCode: "14604", timeZone: "America/New_York" },
            { id: 1009, name: "Albany", zipCode: "12201", timeZone: "America/New_York" },
            { id: 1010, name: "Syracuse", zipCode: "13201", timeZone: "America/New_York" }
          ]
        },
        {
          id: 103,
          name: "Texas",
          cities: [
            { id: 1011, name: "Houston", zipCode: "77001", timeZone: "America/Chicago" },
            { id: 1012, name: "Dallas", zipCode: "75201", timeZone: "America/Chicago" },
            { id: 1013, name: "Austin", zipCode: "73301", timeZone: "America/Chicago" },
            { id: 1014, name: "San Antonio", zipCode: "78201", timeZone: "America/Chicago" },
            { id: 1015, name: "Fort Worth", zipCode: "76101", timeZone: "America/Chicago" }
          ]
        },
        {
          id: 104,
          name: "Florida",
          cities: [
            { id: 1016, name: "Miami", zipCode: "33101", timeZone: "America/New_York" },
            { id: 1017, name: "Orlando", zipCode: "32801", timeZone: "America/New_York" },
            { id: 1018, name: "Tampa", zipCode: "33601", timeZone: "America/New_York" },
            { id: 1019, name: "Jacksonville", zipCode: "32201", timeZone: "America/New_York" },
            { id: 1020, name: "Fort Lauderdale", zipCode: "33301", timeZone: "America/New_York" }
          ]
        },
        {
          id: 105,
          name: "Illinois",
          cities: [
            { id: 1021, name: "Chicago", zipCode: "60601", timeZone: "America/Chicago" },
            { id: 1022, name: "Springfield", zipCode: "62701", timeZone: "America/Chicago" },
            { id: 1023, name: "Peoria", zipCode: "61601", timeZone: "America/Chicago" },
            { id: 1024, name: "Champaign", zipCode: "61801", timeZone: "America/Chicago" },
            { id: 1025, name: "Rockford", zipCode: "61101", timeZone: "America/Chicago" }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Canada",
      states: [
        {
          id: 201,
          name: "Ontario",
          cities: [
            { id: 2001, name: "Toronto", zipCode: "M5H 1T1", timeZone: "America/Toronto" },
            { id: 2002, name: "Ottawa", zipCode: "K1P 1J1", timeZone: "America/Toronto" },
            { id: 2003, name: "Mississauga", zipCode: "L5B 3C2", timeZone: "America/Toronto" },
            { id: 2004, name: "Hamilton", zipCode: "L8P 1A1", timeZone: "America/Toronto" },
            { id: 2005, name: "London", zipCode: "N6A 1H3", timeZone: "America/Toronto" }
          ]
        },
        {
          id: 202,
          name: "Quebec",
          cities: [
            { id: 2006, name: "Montreal", zipCode: "H2Y 1T1", timeZone: "America/Montreal" },
            { id: 2007, name: "Quebec City", zipCode: "G1K 8M8", timeZone: "America/Montreal" },
            { id: 2008, name: "Laval", zipCode: "H7T 1C8", timeZone: "America/Montreal" },
            { id: 2009, name: "Gatineau", zipCode: "J8X 3X7", timeZone: "America/Montreal" },
            { id: 2010, name: "Longueuil", zipCode: "J4K 2T3", timeZone: "America/Montreal" }
          ]
        },
        {
          id: 203,
          name: "Alberta",
          cities: [
            { id: 2011, name: "Calgary", zipCode: "T2P 1J9", timeZone: "America/Edmonton" },
            { id: 2012, name: "Edmonton", zipCode: "T5J 0H6", timeZone: "America/Edmonton" },
            { id: 2013, name: "Red Deer", zipCode: "T4N 1S6", timeZone: "America/Edmonton" },
            { id: 2014, name: "Lethbridge", zipCode: "T1J 1W5", timeZone: "America/Edmonton" },
            { id: 2015, name: "Medicine Hat", zipCode: "T1A 0A1", timeZone: "America/Edmonton" }
          ]
        },
        {
          id: 204,
          name: "British Columbia",
          cities: [
            { id: 2016, name: "Vancouver", zipCode: "V5K 0A1", timeZone: "America/Vancouver" },
            { id: 2017, name: "Victoria", zipCode: "V8W 1P6", timeZone: "America/Vancouver" },
            { id: 2018, name: "Surrey", zipCode: "V3R 0A1", timeZone: "America/Vancouver" },
            { id: 2019, name: "Burnaby", zipCode: "V5C 0E7", timeZone: "America/Vancouver" },
            { id: 2020, name: "Kelowna", zipCode: "V1Y 1R3", timeZone: "America/Vancouver" }
          ]
        },
        {
          id: 205,
          name: "Manitoba",
          cities: [
            { id: 2021, name: "Winnipeg", zipCode: "R3C 0B6", timeZone: "America/Winnipeg" },
            { id: 2022, name: "Brandon", zipCode: "R7A 6E9", timeZone: "America/Winnipeg" },
            { id: 2023, name: "Steinbach", zipCode: "R5G 1P5", timeZone: "America/Winnipeg" },
            { id: 2024, name: "Thompson", zipCode: "R8N 1W4", timeZone: "America/Winnipeg" },
            { id: 2025, name: "Portage la Prairie", zipCode: "R1N 3Z9", timeZone: "America/Winnipeg" }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "United Kingdom",
      states: [
        {
          id: 301,
          name: "England",
          cities: [
            { id: 3001, name: "London", zipCode: "EC1A 1AA", timeZone: "Europe/London" },
            { id: 3002, name: "Manchester", zipCode: "M2 1AB", timeZone: "Europe/London" },
            { id: 3003, name: "Birmingham", zipCode: "B1 1AA", timeZone: "Europe/London" },
            { id: 3004, name: "Liverpool", zipCode: "L1 1AA", timeZone: "Europe/London" },
            { id: 3005, name: "Leeds", zipCode: "LS1 1AA", timeZone: "Europe/London" }
          ]
        },
        {
          id: 302,
          name: "Scotland",
          cities: [
            { id: 3006, name: "Glasgow", zipCode: "G1 1AA", timeZone: "Europe/London" },
            { id: 3007, name: "Edinburgh", zipCode: "EH1 1AA", timeZone: "Europe/London" },
            { id: 3008, name: "Aberdeen", zipCode: "AB1 1AA", timeZone: "Europe/London" },
            { id: 3009, name: "Dundee", zipCode: "DD1 1AA", timeZone: "Europe/London" },
            { id: 3010, name: "Inverness", zipCode: "IV1 1AA", timeZone: "Europe/London" }
          ]
        },
        {
          id: 303,
          name: "Wales",
          cities: [
            { id: 3011, name: "Cardiff", zipCode: "CF1 1AA", timeZone: "Europe/London" },
            { id: 3012, name: "Swansea", zipCode: "SA1 1AA", timeZone: "Europe/London" },
            { id: 3013, name: "Newport", zipCode: "NP1 1AA", timeZone: "Europe/London" },
            { id: 3014, name: "Bangor", zipCode: "LL57 1AA", timeZone: "Europe/London" },
            { id: 3015, name: "Wrexham", zipCode: "LL11 1AA", timeZone: "Europe/London" }
          ]
        },
        {
          id: 304,
          name: "Northern Ireland",
          cities: [
            { id: 3016, name: "Belfast", zipCode: "BT1 1AA", timeZone: "Europe/London" },
            { id: 3017, name: "Londonderry", zipCode: "BT48 1AA", timeZone: "Europe/London" },
            { id: 3018, name: "Armagh", zipCode: "BT61 1AA", timeZone: "Europe/London" },
            { id: 3019, name: "Newry", zipCode: "BT35 1AA", timeZone: "Europe/London" },
            { id: 3020, name: "Enniskillen", zipCode: "BT74 1AA", timeZone: "Europe/London" }
          ]
        }
      ]
    }
  ];
  
  // Function to get states for a given country
  export function getStates(countryId: number): State[] | undefined {
    const country = countries.find((country) => country.id === countryId);
    return country?.states;
  }
  
  // Function to get cities for a given state
  export function getCities(countryId: number, stateId: number): City[] | undefined {
    const states = getStates(countryId);
    const state = states?.find((state) => state.id === stateId);
    return state?.cities;
  }
  
  // Function to get zip code and time zone for a given city
  export function getCityDetails(countryId: number, stateId: number, cityId: number): { zipCode: string; timeZone: string } | undefined {
    const cities = getCities(countryId, stateId);
    const city = cities?.find((city) => city.id === cityId);
    if (city) {
      return { zipCode: city.zipCode, timeZone: city.timeZone };
    }
    return undefined;
  }
  
  export default countries;
  