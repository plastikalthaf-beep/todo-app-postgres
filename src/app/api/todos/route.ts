import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma'; // Import dari singleton

// GET: Ambil semua todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

// POST: Tambah todo baru
export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title required' }, { status: 400 });
    }

    const todo = await prisma.todo.create({
      data: { title: title.trim() },
    });
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}