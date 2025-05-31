// Use environment variable or fallback to default backend URL
const baseURL = import.meta.env.VITE_SERVER_URL || 'https://wdd330-backend.onrender.com/';

// Converts fetch response to JSON if OK, otherwise throws an error with status and response text
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    return res.text().then((text) => {
      throw new Error(`Bad Response: ${res.status} - ${text}`); // Changed error to include status and text for better debugging
    });
  }
}

export default class ExternalServices {
  constructor(category = '') {
    this.category = category; // Store category if provided
  }

  // Fetch products by category, defaults to stored category
  async getData(category = this.category) {
    if (!category) throw new Error("No category provided");
    const url = `${baseURL}products/search/${category}`;
    console.log("Fetch URL in getData():", url); // Added log for debugging fetch URL
    const response = await fetch(url);
    const data = await convertToJson(response);
    return data.Result;
  }

  // Send checkout payload to backend
  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }

  // Find a product by ID from fetched product list
  async findProductById(id) {
    const products = await this.getData(); // Use stored category
    console.log("Products returned from getData():", products); // Added log for debugging returned products
    const product = products.find(p => p.Id === id);

    if (!product) throw new Error("Product not found");
    return product;
  }
}
