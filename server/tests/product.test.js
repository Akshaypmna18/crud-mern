import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../index.js";
import Product from "../models/product.model.js";

describe("Product API", () => {
  beforeEach(async () => {
    // Clear products before each test
    await Product.deleteMany({});
  });

  describe("GET /products", () => {
    it("should get all products with pagination", async () => {
      // Create test products
      await Product.create([
        {
          name: "Product 1",
          quantity: 10,
          price: 100,
          image: "https://example.com/1.jpg",
        },
        {
          name: "Product 2",
          quantity: 20,
          price: 200,
          image: "https://example.com/2.jpg",
        },
      ]);

      const response = await request(app).get("/products").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
    });

    it("should handle search parameter", async () => {
      await Product.create([
        {
          name: "iPhone",
          quantity: 10,
          price: 1000,
          image: "https://example.com/iphone.jpg",
        },
        {
          name: "Samsung",
          quantity: 15,
          price: 800,
          image: "https://example.com/samsung.jpg",
        },
      ]);

      const response = await request(app)
        .get("/products?search=iPhone")
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe("iPhone");
    });
  });

  describe("POST /products", () => {
    it("should create a new product", async () => {
      const productData = {
        name: "Test Product",
        quantity: 50,
        price: 99.99,
        image: "https://example.com/test.jpg",
      };

      const response = await request(app)
        .post("/products")
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(productData.name);
      expect(response.body.data.totalValue).toBe(4999.5);
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/products")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it("should validate data types", async () => {
      const response = await request(app)
        .post("/products")
        .send({
          name: "Test",
          quantity: "not-a-number",
          price: "invalid",
          image: "not-a-url",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /products/:id", () => {
    it("should get a single product", async () => {
      const product = await Product.create({
        name: "Test Product",
        quantity: 10,
        price: 100,
        image: "https://example.com/test.jpg",
      });

      const response = await request(app)
        .get(`/products/${product._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Test Product");
    });

    it("should return 404 for non-existent product", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app)
        .get(`/products/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it("should validate ObjectId format", async () => {
      const response = await request(app)
        .get("/products/invalid-id")
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /products/:id", () => {
    it("should update a product", async () => {
      const product = await Product.create({
        name: "Original Name",
        quantity: 10,
        price: 100,
        image: "https://example.com/original.jpg",
      });

      const updateData = {
        name: "Updated Name",
        quantity: 20,
      };

      const response = await request(app)
        .put(`/products/${product._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Updated Name");
      expect(response.body.data.quantity).toBe(20);
    });
  });

  describe("DELETE /products/:id", () => {
    it("should delete a product", async () => {
      const product = await Product.create({
        name: "To Delete",
        quantity: 10,
        price: 100,
        image: "https://example.com/delete.jpg",
      });

      const response = await request(app)
        .delete(`/products/${product._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Product deleted successfully");

      // Verify product is deleted
      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).toBeNull();
    });
  });

  describe("GET /products/kpi", () => {
    it("should calculate KPIs correctly", async () => {
      await Product.create([
        {
          name: "Product 1",
          quantity: 10,
          price: 100,
          image: "https://example.com/1.jpg",
        },
        {
          name: "Product 2",
          quantity: 20,
          price: 200,
          image: "https://example.com/2.jpg",
        },
      ]);

      const response = await request(app).get("/products/kpi").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalProducts).toBe(2);
      expect(response.body.data.totalValue).toBe(5000); // (10*100) + (20*200)
      expect(response.body.data.totalUnits).toBe(30);
    });
  });
});
