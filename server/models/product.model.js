const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      max: [10000, "Quantity cannot exceed 10000"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [999999.99, "Price cannot exceed 999999.99"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      validate: {
        validator: function (v) {
          // Very flexible validation - accepts any HTTPS URL that looks like an image
          // Either ends with image extension OR is from any image hosting service
          const url = v;

          // Test 1: URLs ending with image extensions
          if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
            return true;
          }

          // Test 2: URLs from known image hosting services
          if (
            /^https?:\/\/(ucarecdn\.com|images\.unsplash\.com|picsum\.photos|via\.placeholder\.com|imgur\.com|cloudinary\.com|amazonaws\.com|cdn\.|images\.|img\.|static\.)/i.test(
              url
            )
          ) {
            return true;
          }

          // Test 3: UUID-like patterns common in CDNs (like your ucarecdn URLs)
          if (/^https?:\/\/[^\/]+\/[a-f0-9\-]+\/?$/i.test(url)) {
            return true;
          }

          return false;
        },
        message:
          "Image must be a valid URL from a recognized image hosting service or end with .jpg, .jpeg, .png, .gif, or .webp",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better performance
ProductSchema.index({ name: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
// Compound index for KPI aggregation performance
ProductSchema.index({ price: 1, quantity: 1 });

// Virtual for total value
ProductSchema.virtual("totalValue").get(function () {
  return this.price * this.quantity;
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
