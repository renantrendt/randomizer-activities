import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Database helper functions
export const db = {
  // Categories
  async getCategories() {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  },

  async createCategory(name) {
    return await prisma.category.create({
      data: { name }
    });
  },

  async updateCategory(id, name) {
    return await prisma.category.update({
      where: { id },
      data: { name }
    });
  },

  async deleteCategory(id) {
    return await prisma.category.delete({
      where: { id }
    });
  },

  // Activities
  async getActivities() {
    return await prisma.activity.findMany({
      include: { category: true }
    });
  },

  async createActivity({ name, url, categoryId }) {
    return await prisma.activity.create({
      data: {
        name,
        url,
        categoryId
      },
      include: { category: true }
    });
  },

  async updateActivity({ id, name, url }) {
    return await prisma.activity.update({
      where: { id },
      data: { name, url },
      include: { category: true }
    });
  },

  async deleteActivity(id) {
    return await prisma.activity.delete({
      where: { id }
    });
  }
};
