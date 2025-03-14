//src/app/api/companies/[id]/route.js
import { NextResponse } from 'next/server';
import api from '@/lib/axios';

export async function DELETE(req, { params }) {
  const { id } = params;
  
  try {
    const response = await api.delete(`/company/${id}`);
    return new Response(JSON.stringify({ message: "Company deleted successfully" }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ message: "Error deleting company" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}