import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

export interface User {
    id: string;
    email: string;
    password?: string;
    name?: string;
}

export interface Order {
    id: string;
    userId?: string; // Optional for guest checkout
    items: any[];
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: string;
    shipping: any;
}

export interface DB {
    users: User[];
    orders: Order[];
    products: any[];
}

export async function getDB(): Promise<DB> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Return empty structure if file doesn't exist
        return { users: [], orders: [], products: [] };
    }
}

export async function saveDB(data: DB) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export const db = {
    user: {
        findUnique: async (email: string) => {
            const db = await getDB();
            return db.users.find(u => u.email === email);
        },
        create: async (user: User) => {
            const db = await getDB();
            db.users.push(user);
            await saveDB(db);
            return user;
        }
    },
    order: {
        create: async (order: Order) => {
            const db = await getDB();
            db.orders.push(order);
            await saveDB(db);
            return order;
        },
        update: async (id: string, updates: Partial<Order>) => {
            const db = await getDB();
            const index = db.orders.findIndex(o => o.id === id);
            if (index !== -1) {
                db.orders[index] = { ...db.orders[index], ...updates };
                await saveDB(db);
                return db.orders[index];
            }
            return null;
        }
    }
};
