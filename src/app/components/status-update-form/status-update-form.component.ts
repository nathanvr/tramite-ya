import { Component, inject } from '@angular/core';
import { SheetServiceService } from '../../_services/sheetService/sheet-service.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  data: any;
  filtro = '';
  dataFiltered: any[] = [];
  backup: any;
  loading = false;
  modalLoading = false;
  loadingGestion = false;

  ngOnInit() {
    this.loading = true;
    this.sheetService.getData({ action: 'get_records' }).subscribe({
      next: (response: any) => {
        if (response.status !== 'success') {
          this.toastyService.error(
            response.message,
            'No se pudieron cargar los datos'
          );
          this.loading = false;
          return;
        }

        this.data = response.res.map((item: any) => {
          return {
            ...item,
            editTransactionMode: false,
            editGestionMode: false,
          };
        });
        this.dataFiltered = [...this.data];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.loading = false;
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
          this.toggleEditModeTransaction(data.numero_remision);
          this.modalLoading = false;
        },
        error: (err) => {
          this.toastyService.error(err, 'Error al actualizar');
          this.modalLoading = false;
        },
      });
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
          console.log('Actualización exitosa', res);

          if (res.status !== 'success') {
            this.toastyService.error(
              res.message,
              'No se pudieron cargar los datos'
            );
            this.loadingGestion = false;

            return;
          }
          this.toastyService.success('Actualización exitosa', 'Éxito');
          this.toggleEditModeGestion(data.numero_remision);
          this.loadingGestion = false;
        },
        error: (err) => console.error('Error al actualizar', err),
      });
  }
}
