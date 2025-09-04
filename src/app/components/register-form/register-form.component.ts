import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SheetServiceService } from '../../_services/sheetService/sheet-service.service';
import { ToastrService } from 'ngx-toastr';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  registerForm: FormGroup;
  private sheetService = inject(SheetServiceService);
  private toastyService = inject(ToastrService);

  loading = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      fecha_transaccion: ['', Validators.required],
      numero_remision: ['', Validators.required],
      tipo_movimiento: ['', Validators.required],
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      documento_identidad: ['', Validators.required],
      tipo_vehiculo: ['', Validators.required],
      placa_vehiculo: ['', Validators.required],
      valor: [0, Validators.required],
      medio_pago: ['', Validators.required],
      medio_captacion: ['', Validators.required],
      estado_transaccion: ['', Validators.required],
      estado_gestion: ['', Validators.required],
      nombre_cliente: ['', Validators.required],
      numero_contacto: ['', Validators.required],
      pago_parcial: ['', Validators.required],
      valor_parcial: [0, Validators.required],
      observaciones: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.registerForm.get('pago_parcial')?.valueChanges.subscribe((value) => {
      const valorParcialControl = this.registerForm.get('valor_parcial');
      const valorTotal = this.registerForm.get('valor')?.value;
      if (value === 'Si') {
        valorParcialControl?.enable();
      } else {
        valorParcialControl?.setValue(valorTotal);
        valorParcialControl?.disable();
      }
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      let data = this.registerForm.value;
      data.valor_parcial =
        data.pago_parcial === 'Si' ? data.valor_parcial : data.valor;
      data.valor = data.tipo_movimiento === 'GASTO' ? -data.valor : data.valor;
      data.valor_parcial =
        data.tipo_movimiento === 'GASTO'
          ? -data.valor_parcial
          : data.valor_parcial; // Set pago_parcial to 'No' for expenses

      this.sheetService.saveData({ data, action: 'insert' }).subscribe({
        next: (response: any) => {
          if (response.status !== 'success') {
            this.toastyService.error(
              response.message,
              'No se pudieron cargar los datos'
            );
            this.loading = false;
            return;
          }

          this.registerForm.reset();
          this.loading = false;
          this.toastyService.success('Registro Guardado Exitosamente', 'Éxito');
        },
        error: (error) => {
          console.error('Error saving data', error);
          this.loading = false;
          this.toastyService.error(
            'Ocurrió un error al guardar el registro',
            'Error'
          );
        },
      });
    } else {
      this.registerForm.markAllAsTouched(); // Mark all controls as touched to show validation errors
    }
  }

  invalidField(field: string): boolean {
    const control = this.registerForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  onInputNumber(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, ''); // solo números
    if (raw) {
      // guarda el número limpio en el formControl
      this.registerForm.get(controlName)?.setValue(+raw, { emitEvent: false });
      // muestra con separadores de miles
      input.value = new Intl.NumberFormat('es-CO').format(+raw);
    } else {
      this.registerForm.get(controlName)?.setValue(null, { emitEvent: false });
    }
  }
}
