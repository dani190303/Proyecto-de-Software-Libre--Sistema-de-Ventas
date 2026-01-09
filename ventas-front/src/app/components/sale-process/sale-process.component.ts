import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { Producto } from '../../models/producto.interface';
import { Venta, DetalleVenta } from '../../models/venta.interface';
import { Cliente } from '../../models/cliente.interface';

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
  clienteService = inject(ClienteService);
  router = inject(Router);

  productos: Producto[] = [];
  clientes: Cliente[] = [];
  carrito: DetalleVenta[] = [];

  // Datos Venta
  clienteSeleccionadoId: number | null = null;
  tipoComprobante: 'BOLETA' | 'FACTURA' = 'FACTURA';
  tipoCambio: number = 3.75; // Valor por defecto, editable

  // Formulario agregar
  productoSeleccionadoId: number = 0;
  cantidad: number = 1;
  descuento: number = 0; // Porcentaje

  // Usuario Harcodeado
  userId = 2; // Dani

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.obtenerClientes().subscribe({
      next: (res) => {
        if (res.success) {
          this.clientes = res.data;
          // Seleccionar por defecto "Publico General" (Documento 00000000) si existe
          const general = this.clientes.find(c => c.documento === '00000000');
          if (general) {
            this.clienteSeleccionadoId = general.id_cliente;
          } else if (this.clientes.length > 0) {
            this.clienteSeleccionadoId = this.clientes[0].id_cliente;
          }
        }
      },
      error: (err) => console.error(err)
    });
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

    // Calcular subtotal con descuento
    const precioDesc = producto.precio * (1 - (this.descuento / 100));
    const subtotalNuevo = precioDesc * this.cantidad;

    if (existe) {
      if (existe.cantidad + this.cantidad > producto.stock) {
        alert(`No puedes agregar más stock del disponible (${producto.stock})`);
        return;
      }
      existe.cantidad += this.cantidad;
      // Actualizamos descuento y subtotal del existente (esto podría debatirse, pero simplificamos)
      existe.descuento = this.descuento;
      existe.subtotal = existe.cantidad * (existe.precio_unitario * (1 - (existe.descuento / 100)));
    } else {
      this.carrito.push({
        id_producto: producto.id_producto!,
        nombre_producto: producto.nombre,
        precio_unitario: producto.precio,
        cantidad: this.cantidad,
        descuento: this.descuento,
        subtotal: subtotalNuevo
      });
    }

    // Reset form
    this.productoSeleccionadoId = 0;
    this.cantidad = 1;
    this.descuento = 0;
  }

  quitarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
  }

  actualizarSubtotal(item: DetalleVenta) {
    if (item.cantidad < 1) item.cantidad = 1;
    if ((item.descuento || 0) < 0) item.descuento = 0;
    if ((item.descuento || 0) > 100) item.descuento = 100;

    const precioDesc = item.precio_unitario * (1 - ((item.descuento || 0) / 100));
    item.subtotal = precioDesc * item.cantidad;
  }

  get totalVentaUSD(): number {
    return this.carrito.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  }

  get totalVentaPEN(): number {
    return this.totalVentaUSD * this.tipoCambio;
  }

  registrarVenta() {
    if (this.carrito.length === 0) return;

    if (!confirm(`¿Confirmar venta por USD ${this.totalVentaUSD.toFixed(2)} / PEN ${this.totalVentaPEN.toFixed(2)}?`)) return;

    const venta: Venta = {
      id_usuario: this.userId,
      detalles: this.carrito,
      id_cliente: this.clienteSeleccionadoId,
      tipo_comprobante: this.tipoComprobante,
      tipo_cambio: this.tipoCambio
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
