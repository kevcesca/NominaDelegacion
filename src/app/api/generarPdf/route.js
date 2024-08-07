import puppeteer from 'puppeteer';

export async function POST(request) {
    const { cheques } = await request.json();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let pdfChunks = [];

    for (let cheque of cheques) {
        const content = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .cheque { border: 1px solid black; padding: 16px; margin-bottom: 16px; }
                    </style>
                </head>
                <body>
                    <div class="cheque">
                        <h1>Cheque</h1>
                        <p><strong>Poliza No:</strong> ${cheque.poliza}</p>
                        <p><strong>No De:</strong> ${cheque.cheque}</p>
                        <p><strong>No Empleado:</strong> ${cheque.id_empleado}</p>
                        <p><strong>Nombre Beneficiario:</strong> ${cheque.nombre} ${cheque.apellido_1} ${cheque.apellido_2}</p>
                        <p><strong>Importe Letra:</strong> ${cheque.importeLetra || ''}</p>
                        <p><strong>Concepto Pago:</strong> ${cheque.conceptoPago || ''}</p>
                        <p><strong>RFC:</strong> ${cheque.id_legal}</p>
                        <p><strong>Tipo Nomina:</strong> ${cheque.nombre_nomina}</p>
                        <p><strong>Percepciones:</strong> ${cheque.percepciones}</p>
                        <p><strong>Deducciones:</strong> ${cheque.deducciones}</p>
                        <p><strong>Liquido:</strong> ${cheque.liquido}</p>
                        <p><strong>Fecha:</strong> ${cheque.fecha || ''}</p>
                    </div>
                </body>
            </html>
        `;

        await page.setContent(content);
        const pdf = await page.pdf({ format: 'A4' });
        pdfChunks.push(pdf);
    }

    await browser.close();

    // Combine all PDF buffers
    const combinedPdf = Buffer.concat(pdfChunks);

    return new Response(combinedPdf, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="cheques.pdf"',
        },
    });
}
