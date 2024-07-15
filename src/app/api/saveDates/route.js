import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const data = await req.json();
        const filePath = path.join(process.cwd(), 'src/app/%Components/ConfigurableTable/data.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ message: 'Dates saved successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to save dates' }, { status: 500 });
    }
}
