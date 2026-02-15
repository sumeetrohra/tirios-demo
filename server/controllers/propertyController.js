const path = require("path");
const properties = require(path.join(__dirname, "../data/properties.json"));

// GET /api/properties
// Supports query params: type, location, minROI, maxROI, priceMin, priceMax, status, sortBy
const getAllProperties = (req, res) => {
  try {
    let result = [...properties];

    const { type, location, minROI, maxROI, priceMin, priceMax, status, sortBy } = req.query;

    // Filter by property type
    if (type && type !== "all") {
      result = result.filter((p) => p.type === type);
    }

    // Filter by location (case-insensitive partial match)
    if (location) {
      result = result.filter((p) =>
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by ROI range
    if (minROI) {
      result = result.filter((p) => parseFloat(p.roi) >= parseFloat(minROI));
    }
    if (maxROI) {
      result = result.filter((p) => parseFloat(p.roi) <= parseFloat(maxROI));
    }

    // Filter by price range
    if (priceMin) {
      result = result.filter((p) => p.price.usd >= Number(priceMin));
    }
    if (priceMax) {
      result = result.filter((p) => p.price.usd <= Number(priceMax));
    }

    // Filter by funding status
    if (status && status !== "all") {
      result = result.filter((p) => {
        const fundedPct = parseInt(p.metrics.funded);
        switch (status) {
          case "new":
            return fundedPct <= 30;
          case "active":
            return fundedPct > 30 && fundedPct < 90;
          case "almostFunded":
            return fundedPct >= 90;
          default:
            return true;
        }
      });
    }

    // Sort
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          result.sort((a, b) => a.price.usd - b.price.usd);
          break;
        case "priceDesc":
          result.sort((a, b) => b.price.usd - a.price.usd);
          break;
        case "roiDesc":
          result.sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi));
          break;
        case "fundingDesc":
          result.sort(
            (a, b) => parseInt(b.metrics.funded) - parseInt(a.metrics.funded)
          );
          break;
        default:
          break;
      }
    }

    res.status(200).json({
      success: true,
      count: result.length,
      properties: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/properties/featured
// Returns the top 3 properties (for the Home page)
const getFeaturedProperties = (req, res) => {
  try {
    const featured = properties.slice(0, 3);
    res.status(200).json({
      success: true,
      properties: featured,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/properties/:id
const getPropertyById = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const property = properties.find((p) => p.id === id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProperties,
  getFeaturedProperties,
  getPropertyById,
};
