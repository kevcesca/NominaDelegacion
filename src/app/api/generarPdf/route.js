import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { cheques } = await request.json();
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .cheque { page-break-after: always; margin-bottom: 20px; }
                    .cheque:last-child { page-break-after: auto; }
                </style>
            </head>
            <body>
                ${cheques.map((cheque, index) => `
                    <div class="cheque">
                        <h1>Cheque #${index + 1}</h1>
                        <p>Poliza No: ${cheque.poliza}</p>
                        <p>No De: ${cheque.cheque}</p>
                        <p>No Empleado: ${cheque.id_empleado}</p>
                        <p>Nombre Beneficiario: ${cheque.nombre} ${cheque.apellido_1} ${cheque.apellido_2}</p>
                        <p>RFC: ${cheque.id_legal}</p>
                        <p>Percepciones: ${cheque.percepciones}</p>
                        <p>Deducciones: ${cheque.deducciones}</p>
                        <p>Liquido: ${cheque.liquido}</p>
                        <p>Fecha: 15/04/2024</p>
                    </div>
                `).join('')}
            </body>
            </html>
        `;

        await page.setContent(htmlContent, { waitUntil: 'load' });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });

        await browser.close();

        return new NextResponse(pdf, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=cheques.pdf'
            }
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to generate PDF' }), { status: 500 });
    }
}
