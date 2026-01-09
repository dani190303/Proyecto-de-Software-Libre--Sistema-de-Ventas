import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    constructor() { }

    generateBoleta(venta: any) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // --- CONSULTAR DATOS DE LA EMPRESA (O usar los del PDF de ejemplo) ---
        const empresa = {
            nombre: 'SERVICIOS GENERALES QWERTY',
            propietario: 'SALAZAR RENGIFO LUIS ENRIQUE',
            ruc: '10751401740',
            direccion: 'AV. AVIACION MZ B LT 08, FRENTE AL SENATI',
            ciudad: 'CORONEL PORTILLO, PUCALLPA',
            telefono: '+51 970 986 688',
            email: 'ventas@qwerty.com.pe' // Placeholder
        };

        // --- COLORES & ESTILOS ---
        const primaryColor = '#005f73'; // Teal/Dark Blue

        // --- ENCABEZADO (HEADER) ---
        // Fondo del encabezado
        doc.setFillColor(primaryColor);
        doc.rect(0, 0, pageWidth, 40, 'F');

        // Logo (Texto Placeholder por ahora)
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('QWERTY', 15, 18);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Servicios Generales', 15, 24);

        // Texto de la Empresa (Derecha)
        doc.setFontSize(14);
        doc.text('COTIZACIÓN', pageWidth - 15, 15, { align: 'right' });
        doc.setFontSize(10);
        doc.text(`RUC: ${empresa.ruc}`, pageWidth - 15, 22, { align: 'right' });
        doc.setFontSize(9);
        doc.text(empresa.direccion, pageWidth - 15, 28, { align: 'right' });
        doc.text(empresa.ciudad, pageWidth - 15, 33, { align: 'right' });

        // --- INFO DEL CLIENTE & VENTA ---
        let yPos = 55;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Datos del Cliente', 15, yPos);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        yPos += 7;
        doc.text(`Cliente: ${venta.cliente_nombres || 'Cliente Genérico'} ${venta.cliente_apellidos || ''}`, 15, yPos);

        const documentoCliente = venta.documento || venta.cliente_documento || '-';
        doc.text(`RUC/DNI: ${documentoCliente}`, 15, yPos + 6);
        doc.text(`Dirección: ${venta.cliente_direccion || 'UCAYALI'}`, 15, yPos + 12);

        // Bloque derecho (Fecha y Numero)
        doc.setFont('helvetica', 'bold');
        doc.text(`N° Venta: ${venta.id_venta.toString().padStart(6, '0')}`, pageWidth - 15, yPos - 7, { align: 'right' });
        doc.setFont('helvetica', 'normal');

        const datePipe = new DatePipe('en-US');
        const fechaFormatted = datePipe.transform(venta.fecha, 'dd/MM/yyyy HH:mm');
        doc.text(`Fecha: ${fechaFormatted}`, pageWidth - 15, yPos, { align: 'right' });
        doc.text(`Moneda: DÓLARES (US$)`, pageWidth - 15, yPos + 6, { align: 'right' });

        // --- TABLA DE PRODUCTOS ---
        yPos += 25;

        // Mapeo de datos para la tabla
        const bodyData = venta.detalles.map((item: any, index: number) => {
            const itemNumber = (index + 1).toString().padStart(3, '0'); // 001
            const descuento = item.descuento ? `${item.descuento}%` : '0%';

            return [
                itemNumber,
                item.producto_nombre,
                item.cantidad,
                `$ ${parseFloat(item.precio_unitario).toFixed(2)}`,
                descuento,
                `$ ${parseFloat(item.subtotal).toFixed(2)}`
            ];
        });

        autoTable(doc, {
            startY: yPos,
            head: [['ITEM', 'DESCRIPCIÓN', 'CANTIDAD', 'P. UNITARIO', 'DESCUENTO', 'TOTAL']],
            body: bodyData,
            theme: 'grid',
            headStyles: {
                fillColor: primaryColor,
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: {
                textColor: 50
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 15 },
                2: { halign: 'center', cellWidth: 20 },
                3: { halign: 'right', cellWidth: 25 },
                4: { halign: 'center', cellWidth: 20 },
                5: { halign: 'right', cellWidth: 25 }
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            styles: {
                font: 'helvetica',
                fontSize: 9,
                cellPadding: 3,
                valign: 'middle'
            }
        });

        // --- TOTALES Y CONVERSIÓN ---
        let finalY = (doc as any).lastAutoTable.finalY + 10;

        // Totales en DÓLARES
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');

        const totalUSD = parseFloat(venta.total_usd || venta.total);
        // IGV es 0 según requerimiento (Subtotal = Total)
        const subtotalUSD = totalUSD;
        const igvUSD = 0;

        const rightMargin = pageWidth - 15;
        const valueX = rightMargin;
        const labelX = rightMargin - 40;

        // 1. Subtotal
        doc.text('SUBTOTAL US$:', labelX, finalY, { align: 'right' });
        doc.text(`$ ${subtotalUSD.toFixed(2)}`, valueX, finalY, { align: 'right' });

        // 2. IGV (0)
        doc.text('IGV (0%) US$:', labelX, finalY + 6, { align: 'right' });
        doc.text(`$ ${igvUSD.toFixed(2)}`, valueX, finalY + 6, { align: 'right' });

        // 3. Total USD
        doc.setFontSize(12);
        doc.setTextColor(primaryColor);
        doc.text('TOTAL US$:', labelX, finalY + 14, { align: 'right' });
        doc.text(`$ ${totalUSD.toFixed(2)}`, valueX, finalY + 14, { align: 'right' });

        // 4. Conversión a Soles (AL LADO IZQUIERDO del bloque de Totales Dolares)
        // Usamos una posición X relativa al ancho de la página, por ejemplo a la mitad o un poco más a la izquierda
        const leftBlockX = labelX - 60; // 60 unidades a la izquierda de la etiqueta "TOTAL US$"

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const tipoCambio = parseFloat(venta.tipo_cambio || '3.70');
        doc.text(`T. Cambio: S/. ${tipoCambio.toFixed(2)}`, leftBlockX, finalY + 6, { align: 'right' }); // Alineado con IGV

        const totalPEN = parseFloat(venta.total_pen || (totalUSD * tipoCambio).toString());
        doc.setFontSize(12);
        doc.setTextColor(primaryColor); // Mismo color que Total USD
        doc.text(`TOTAL S/: S/. ${totalPEN.toFixed(2)}`, leftBlockX, finalY + 14, { align: 'right' }); // Alineado con Total USD

        // --- TÉRMINOS Y CONDICIONES ---
        let termsY = finalY + 30; // Reducido el espacio ya que subimos los totales

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('TERMINOS Y CONDICIONES GENERALES', 15, termsY);
        doc.line(15, termsY + 1, 85, termsY + 1); // Subrayado

        doc.setFontSize(9);
        termsY += 8;

        // 1. Tiempo de entrega
        doc.setFont('helvetica', 'bold');
        doc.text('1.   Tiempo de entrega', 20, termsY);
        doc.text('7 días', 90, termsY);

        // 2. Validez de la Oferta
        termsY += 6;
        doc.text('2.   Validez de la Oferta', 20, termsY);
        doc.text('15 días Útiles', 90, termsY);

        // 3. Forma de pago
        termsY += 6;
        doc.text('3.   Forma de pago', 20, termsY);

        // Checkbox simulado (Contado)
        doc.setFillColor(0, 0, 0);
        doc.rect(90, termsY - 3, 3, 3, 'F'); // Cuadrado lleno
        doc.text(' Contado', 94, termsY);

        // Checkbox simulado (Crédito)
        termsY += 5;
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(0, 0, 0);
        doc.rect(90, termsY - 3, 3, 3, 'S'); // Cuadrado vacío
        doc.text(' Crédito 30 días', 94, termsY);

        // --- INFORMACIÓN ADICIONAL ---
        termsY += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('Información adicional sobre el Total del Precio incluido en este Presupuesto', 15, termsY);
        doc.line(15, termsY + 1, 145, termsY + 1);

        doc.setFont('helvetica', 'normal');
        termsY += 8;
        const text4 = '4.   El precio de venta en soles es referencial y ha sido calculado utilizando el tipo de cambio venta a la fecha vigente del presente Presupuesto.';
        const splitText4 = doc.splitTextToSize(text4, pageWidth - 30);
        doc.text(splitText4, 20, termsY);

        termsY += (splitText4.length * 5) + 2;
        const text5 = '5.   La facturación se realizará acorde al tipo de moneda de cambio efectuada por el cliente a las cuentas de SERVICIOS GENERALES QWERTY';
        const splitText5 = doc.splitTextToSize(text5, pageWidth - 30);
        // Negrita para el nombre de la empresa en el punto 5
        doc.text(splitText5, 20, termsY);

        // --- TABLA DE CUENTAS BANCARIAS ---
        termsY += (splitText5.length * 5) + 5;

        autoTable(doc, {
            startY: termsY,
            head: [['CTA CORRIENTE', 'INTERBANCARIO', 'MONEDA', 'BANCO']],
            body: [
                ['47574276778005', '00247517427677800525', 'S/. NUEVOS SOLES', 'BCO. DE CREDITO'],
                ['48004739258191', '00248010473925819124', '$ DOLARES', 'BCO. DE CREDITO'],
                ['898-3377591942', '003-898-013377591942-45', '$ DOLARES', 'INTERBANK']
            ],
            theme: 'grid',
            headStyles: {
                fillColor: [255, 255, 255], // Blanco
                textColor: 0, // Negro
                fontStyle: 'bold',
                halign: 'center',
                lineWidth: 0.1,
                lineColor: 0
            },
            bodyStyles: {
                textColor: 0,
                halign: 'center',
                lineWidth: 0.1,
                lineColor: 0
            },
            styles: {
                font: 'helvetica',
                fontSize: 9,
                cellPadding: 2,
                lineColor: 0,
                lineWidth: 0.1
            }
        });

        // --- PIE DE PAGINA FINAL ---
        const footerY = 285; // Muy abajo
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Generado por Sistema de Ventas DSSL', pageWidth / 2, footerY, { align: 'center' });

        // Guardar PDF
        doc.save(`Boleta_Venta_${venta.id_venta}.pdf`);
    }
}
