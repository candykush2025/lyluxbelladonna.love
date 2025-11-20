// lib/geolocation.ts
export interface LocationData {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

export const getUserLocation = async (): Promise<LocationData | null> => {
  try {
    const response = await fetch("http://ip-api.com/json/");
    const data = await response.json();

    if (data.status === "success") {
      return data as LocationData;
    }

    return null;
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};
