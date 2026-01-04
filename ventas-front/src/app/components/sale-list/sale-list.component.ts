import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.css']
})
export class SaleListComponent implements OnInit {
  ventaService = inject(VentaService);
  ventas: any[] = [];

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas() {
    this.ventaService.getVentas().subscribe({
      next: (res) => {
        if (res.success) {
          this.ventas = res.data;
        }
      },
      error: (err) => console.error(err)
    });
  }
}
