import {
  AddItemInput,
  CategoryInput,
  RemoveItemInput,
} from "../dto/category-input";
import { categories, CategoryDoc } from "../models";

export class CategoryRepository {
  constructor() {}

  async createCategory({ name, parentId, imageUrl }: CategoryInput) {
    const newCategory = await categories.create({
      name,
      parentId,
      subCategory: [],
      products: [],
      imageUrl,
    });

    if (parentId) {
      const parentCategory = (await categories.findById(
        parentId
      )) as CategoryDoc;

      parentCategory.subCategories.push(newCategory);
      await parentCategory.save();
    }

    return newCategory;
  }

  async getAllCategories(offset = 0, perPage?: number) {
    return categories
      .find({ parentId: null })
      .populate({
        path: "subCategories",
        model: "categories",
        populate: {
          path: "subCategories",
          model: "categories",
        },
      })
      .skip(offset)
      .limit(perPage ? perPage : 100);
  }

  async getTopCategories() {
    return categories
      .find(
        {
          parentId: {
            $ne: null,
          },
        },
        {
          products: { $slice: 10 },
        }
      )
      .populate({
        path: "subCategories",
        model: "categories",
      })
      .sort({ displayOrder: "descending" })
      .limit(10);
  }

  async getCategoryById(id: string, offset = 0, perPage?: number) {
    return categories
      .findById(id, {
        products: { $slice: [offset, perPage ? perPage : 100] },
      })
      .populate({
        path: "products",
        model: "products",
      });
  }

  async updateCategory({ id, name, displayOrder, imageUrl }: CategoryInput) {
    let category = (await categories.findById(id)) as CategoryDoc;
    category.name = name;
    category.displayOrder = displayOrder;
    category.imageUrl = imageUrl;
    return category.save();
  }

  deleteCategory(id: string) {
    return categories.deleteOne({ _id: id });
  }

  async addItem({ id, products }: AddItemInput) {
    let category = (await categories.findById(id)) as CategoryDoc;
    category.products.push(...products);
    return category.save();
  }

  async removeItem({ id, products }: RemoveItemInput) {
    let category = (await categories.findById(id)) as CategoryDoc;
    const excludeProducts = category.products.filter(
      (item) => !products.includes(item.toString())
    );

    category.products = excludeProducts;
    return category.save();
  }
}
