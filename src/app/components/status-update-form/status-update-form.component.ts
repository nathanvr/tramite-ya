import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { SheetServiceService } from '../../_services/sheetService/sheet-service.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-status-update-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './status-update-form.component.html',
  styleUrl: './status-update-form.component.scss',
})
export class StatusUpdateFormComponent {
  private sheetService = inject(SheetServiceService);
  private toastyService = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  data: any;
  filtro = '';
  dataFiltered: any[] = [];
  backup: any;
  loading = signal<boolean>(false);
  modalLoading = false;
  loadingGestion = false;

  ngOnInit() {
    this.loading.set(true);
    this.sheetService
      .getData({ action: 'get_records' })

      .subscribe({
        next: (response: any) => {
          if (response.status !== 'success') {
            this.toastyService.error(
              response.message,
              'No se pudieron cargar los datos'
            );
            this.loading.set(false);
            return;
          }

          this.data = response.res.map((item: any) => {
            return {
              ...item,
              editTransactionMode: false,
              editGestionMode: false,
              estado_gestion_original: item.estado_gestion,
              estado_transaccion_original: item.estado_transaccion,
            };
          });
          this.dataFiltered = [...this.data];
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.loading.set(false);
          this.toastyService.error(error, 'Error al cargar los datos');
        },
      });
  }

  aplicarFiltro() {
    const filtroLower = this.filtro.toLowerCase();
    this.dataFiltered = this.data.filter((r: any) =>
      Object.values(r).some((val: any) =>
        String(val).toLowerCase().includes(filtroLower)
      )
    );
  }

  toggleEditModeTransaction(numRemision: any) {
    this.dataFiltered = this.dataFiltered.map((registro) => {
      return registro.numero_remision === numRemision
        ? { ...registro, editTransactionMode: !registro.editTransactionMode }
        : registro;
    });
  }

  sendUpdateTransaction(row: any) {
    if (this.onEstadoTransaccionChange(row, row.estado_transaccion)) {
      this.modalLoading = true;
      const data = {
        numero_remision: row.numero_remision,
        col: 'estado_transaccion',
        row: row.fila,
        value: row.estado_transaccion,
      };
      this.sheetService
        .updateRecord({ data, action: 'update_record' })
        .subscribe({
          next: (res: any) => {
            if (res.status !== 'success') {
              this.toastyService.error(
                res.message,
                'No se pudieron cargar los datos'
              );
              this.modalLoading = false;

              return;
            }
            this.toastyService.success('Actualización exitosa', 'Éxito');
            row.estado_transaccion_original = row.estado_transaccion;
            this.toggleEditModeTransaction(data.numero_remision);
            this.modalLoading = false;
          },
          error: (err) => {
            this.toastyService.error(err, 'Error al actualizar');
            this.modalLoading = false;
          },
        });
    } else {
      this.toastyService.warning('No se realizaron cambios', 'Atención');
    }
  }

  //-------------------------------------------------------------

  toggleEditModeGestion(numRemision: any) {
    this.dataFiltered = this.dataFiltered.map((registro) => {
      return registro.numero_remision === numRemision
        ? { ...registro, editGestionMode: !registro.editGestionMode }
        : registro;
    });
  }

  sendUpdateGestion(row: any) {
    if (this.onEstadoGestionChange(row, row.estado_gestion)) {
      this.loadingGestion = true;
      const data = {
        numero_remision: row.numero_remision,
        col: 'estado_gestion',
        row: row.fila,
        value: row.estado_gestion,
      };

      this.sheetService
        .updateRecord({ data, action: 'update_record' })
        .subscribe({
          next: (res: any) => {
            if (res.status !== 'success') {
              this.toastyService.error(
                res.message,
                'No se pudieron cargar los datos'
              );
              this.loadingGestion = false;

              return;
            }
            this.toastyService.success('Actualización exitosa', 'Éxito');
            row.estado_gestion_original = row.estado_gestion;
            this.toggleEditModeGestion(data.numero_remision);
            this.loadingGestion = false;
          },
          error: (err) => console.error('Error al actualizar', err),
        });
    } else {
      this.toastyService.warning('No se realizaron cambios', 'Atención');
    }
  }

  onEstadoGestionChange(registro: any, nuevoValor: string) {
    if (registro.estado_gestion_original !== nuevoValor) {
      return true;
    } else {
      return false;
    }
  }

  onEstadoTransaccionChange(registro: any, nuevoValor: string) {
    if (registro.estado_transaccion_original !== nuevoValor) {
      return true;
    } else {
      return false;
    }
  }
  cancelEditGestion(row: any) {
    // 👇 restaurar el valor original
    row.estado_gestion = row.estado_gestion_original;

    // salir del modo edición
    this.toggleEditModeGestion(row.numero_remision);
  }

  cancelEditTransaction(row: any) {
    row.estado_transaccion = row.estado_transaccion_original;
    this.toggleEditModeTransaction(row.numero_remision);
  }
}
