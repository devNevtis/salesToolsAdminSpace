//src/app/api/companies/route.js
import { NextResponse } from 'next/server';
import api from '@/lib/axios';

export async function GET() {
  try {
    const response = await api.get('/company/all');
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch companies' }, 
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const response = await api.post('/company/create', data);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create company' }, 
      { status: 500 }
    );
  }
}