// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/fitness/exercises?q=...&category=...&muscles=...&equipment=...
// Search wger exercises, with optional detail/muscle/equipment/category modes
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  searchExercises,
  getExerciseById,
  getMuscleGroups,
  getEquipment,
  getExerciseCategories,
} from '@/lib/api/wger-fitness';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = req.nextUrl;
  const mode = searchParams.get('mode'); // 'detail' | 'muscles' | 'equipment' | 'categories'

  // Special modes
  if (mode === 'muscles') {
    const muscles = await getMuscleGroups();
    return NextResponse.json({ muscles });
  }
  if (mode === 'equipment') {
    const equipment = await getEquipment();
    return NextResponse.json({ equipment });
  }
  if (mode === 'categories') {
    const categories = await getExerciseCategories();
    return NextResponse.json({ categories });
  }
  if (mode === 'detail') {
    const id = Number(searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'Missing ?id= parameter' }, { status: 400 });
    const exercise = await getExerciseById(id);
    if (!exercise) return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    return NextResponse.json({ exercise });
  }

  // Default: exercise search
  const query = searchParams.get('q') ?? searchParams.get('query') ?? undefined;
  const category = Number(searchParams.get('category')) || undefined;
  const muscles = Number(searchParams.get('muscles')) || undefined;
  const equipment = Number(searchParams.get('equipment')) || undefined;
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 20));
  const offset = Math.max(0, Number(searchParams.get('offset')) || 0);

  const result = await searchExercises({ query, category, muscles, equipment, limit, offset });
  return NextResponse.json(result);
}
