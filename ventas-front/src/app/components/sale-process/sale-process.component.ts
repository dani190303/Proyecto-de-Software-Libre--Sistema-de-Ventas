import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { VentaService } from '../../services/venta.service';
import { Producto } from '../../models/producto.interface';
import { Venta, DetalleVenta } from '../../models/venta.interface';

@Component({
  selector: 'app-sale-process',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sale-process.component.html',
  styleUrls: ['./sale-process.component.css']
})
export class SaleProcessComponent implements OnInit {
  productoService = inject(ProductoService);
  ventaService = inject(VentaService);
  router = inject(Router);

  productos: Producto[] = [];
  carrito: DetalleVenta[] = [];

  // Formulario agregar
  productoSeleccionadoId: number = 0;
  cantidad: number = 1;

  // Usuario Harcodeado
  userId = 2; // Dani

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (res) => {
        if (res.success) {
          // Filtrar solo productos con stock > 0 y activos
          this.productos = res.data.filter((p: Producto) => p.stock > 0);
        }
      },
      error: (err) => console.error(err)
    });
  }

  agregarAlCarrito() {
    if (this.productoSeleccionadoId === 0 || this.cantidad <= 0) return;

    const producto = this.productos.find(p => p.id_producto == this.productoSeleccionadoId);
    if (!producto) return;

    if (this.cantidad > producto.stock) {
      alert(`Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}`);
      return;
    }

    // Verificar si ya está en carrito
    const existe = this.carrito.find(d => d.id_producto === producto.id_producto);

    if (existe) {
      if (existe.cantidad + this.cantidad > producto.stock) {
        alert(`No puedes agregar más stock del disponible (${producto.stock})`);
        return;
      }
      existe.cantidad += this.cantidad;
      existe.subtotal = existe.cantidad * existe.precio_unitario;
    } else {
      this.carrito.push({
        id_producto: producto.id_producto!,
        nombre_producto: producto.nombre,
        precio_unitario: producto.precio,
        cantidad: this.cantidad,
        subtotal: this.cantidad * producto.precio
      });
    }

    // Reset form
    this.productoSeleccionadoId = 0;
    this.cantidad = 1;
  }

  quitarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
  }

  get totalVenta(): number {
    return this.carrito.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  }

  registrarVenta() {
    if (this.carrito.length === 0) return;

    if (!confirm('¿Confirmar venta por ' + this.totalVenta + '?')) return;

    const venta: Venta = {
      id_usuario: this.userId,
      detalles: this.carrito
    };

    this.ventaService.createVenta(venta).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Venta registrada con éxito! ID: ' + res.data.id_venta);
          this.carrito = []; // Limpiar carrito
          this.cargarProductos(); // Recargar stock actualizado
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar venta: ' + (err.error?.mensaje || err.message));
      }
    });
  }
}
