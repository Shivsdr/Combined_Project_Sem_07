import mongoose from "mongoose";

const ProductDetailsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  searchedTerm: {
    type: String,
    required: true,
    // unique: true,
  },
  date: {
    type: String,
    required: true,
  },
  products: [
    {
      title: String,
      nextUrl: String,
      price: String,
      link: String,
      image_url: String,
      result: {
        total_reviews: Number,
        positive_reviews: Number,
        positive_rate: String,
      },
    },
  ],
});

const ProductDetails = mongoose.model("ProductDetails", ProductDetailsSchema);

export default ProductDetails;
