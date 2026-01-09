import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VentaService } from '../../services/venta.service';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-sale-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.css']
})
export class SaleDetailComponent implements OnInit {
  ventaService = inject(VentaService);
  pdfService = inject(PdfService); // Inyectar servicio PDF
  route = inject(ActivatedRoute);

  venta: any = null;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.cargarVenta(id);
  }

  cargarVenta(id: number) {
    this.ventaService.getVenta(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.venta = res.data;
        }
      },
      error: (err) => console.error(err)
    });
  }

  imprimirBoleta() {
    if (this.venta) {
      this.pdfService.generateBoleta(this.venta);
    }
  }
}
