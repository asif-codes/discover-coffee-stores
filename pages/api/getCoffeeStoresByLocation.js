import { fetchCoffeeStores } from "../../lib/coffee-stores";

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const fetchedCoffeeStores = await fetchCoffeeStores(latLong, limit);
    res.status(200);
    res.json(fetchedCoffeeStores);
  } catch (err) {
    console.error("There is an error", err);
    res.status(500);
    res.json({ message: "Something went wrong.", err });
  }
};

export default getCoffeeStoresByLocation;
