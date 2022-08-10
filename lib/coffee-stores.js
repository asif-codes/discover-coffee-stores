import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&v=20220105&limit=${limit}`;
};

const getListOfCoffeeStoresPhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  });
  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls.small);
};

export const fetchCoffeeStores = async (
  latLong = "23.81026738233539,90.4127576372144",
  limit = 6
) => {
  const photos = await getListOfCoffeeStoresPhotos();
  const response = await fetch(
    getUrlForCoffeeStores(latLong, "coffee stores", limit),
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      },
    }
  );

  const data = await response.json();
  const transformedData =
    data?.results?.map((venue, idx) => {
      const neighbourhood = venue.location.neighborhood;
      return {
        id: venue.fsq_id,
        address: venue.location.address || "",
        name: venue.name,
        neighbourhood:
          (neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) ||
          venue.location.cross_street ||
          "",
        imgUrl: photos[idx],
      };
    }) || [];

  return transformedData;
};
