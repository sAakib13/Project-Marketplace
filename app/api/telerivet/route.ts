import { NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.TELERIVET_API_KEY;
const PROJECT_ID = process.env.TELERIVET_PROJECT_ID;
const TABLE_ID = process.env.TELERIVET_TABLE_ID;

export async function GET() {
  try {
    const response = await axios.get(
      `https://api.telerivet.com/v1/projects/${PROJECT_ID}/tables/${TABLE_ID}/rows`,
      {
        auth: {
          username: API_KEY || '',
          password: '',
        },
      }
    );

    // Transform the data to match our project structure
    const projects = response.data.data.map((row: any) => ({
      title: row.vars.title || 'Untitled Project',
      description: row.vars.description || 'No description available',
      industry: row.vars.industry ? row.vars.industry.split(',').map((ind: string) => ind.trim()) : ['Uncategorized'],
      links: [
        {
          name: 'Telerivet Campaign',
          url: `https://telerivet.com/dashboard/projects/${row.project_id}`,
          description: row.vars.telerivet_description || 'Campaign automation and tracking',
          icon: '📱'
        },
        {
          name: 'Canva Templates',
          url: row.vars.canva_url || 'https://www.canva.com/',
          description: row.vars.canva_description || 'Brand-aligned visual assets',
          icon: '🎨'
        },
        {
          name: 'HubSpot Analytics',
          url: row.vars.hubspot_url || 'https://app.hubspot.com/',
          description: row.vars.hubspot_description || 'Performance metrics and leads',
          icon: '📊'
        }
      ]
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching data from Telerivet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}