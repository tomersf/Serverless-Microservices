import { ProductInput } from "../dto/product-input";
import { products } from "../models/product-model";

export class ProductRepository {
  constructor() {}

  async createProduct({
    name,
    description,
    price,
    category_id,
    image_url,
  }: ProductInput) {
    return products.create({
      name,
      description,
      price,
      category_id,
      image_url,
      availability: true,
    });
  }

  async getAllProducts(offset = 0, pages?: number) {}

  async getProductById() {}

  async updateProduct({
    name,
    description,
    price,
    category_id,
    image_url,
  }: ProductInput) {}

  async deleteProduct(id: string) {}
}
