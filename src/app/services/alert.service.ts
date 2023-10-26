import { Injectable } from '@angular/core';
import Swal, {SweetAlertIcon} from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  success = (message: string, title?: string) =>  {
    this.showAlert(title,message,'success')
  }

  info = (message: string, title?: string) =>  {
    this.showAlert(title,message,'info')
  }

  error = (message: string, title?: string) =>  {
    this.showAlert(title,message,'error')
  }

  private timerInterval: number | undefined;

  private showAlert(title: string | undefined, message: string, icon: string | undefined) {
    // @ts-ignore
    Swal.fire(title,message,icon)
  }

  showAlertWithTimer = (title: string | undefined, message?: string | undefined) => {
    // @ts-ignore
    Swal.fire({
      title: title,
      message: message,
      timer: 2000,
      timerProgressBar: true,
      icon: 'success',
      didOpen: () => {
        Swal.showLoading(null)
        // @ts-ignore
        const b = Swal.getHtmlContainer().querySelector('b')
        this.timerInterval = setInterval(() => {
          // @ts-ignore
          b.textContent = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => {
        // @ts-ignore
        clearInterval(this.timerInterval)
      }
    })
  }

  animatedModal = (text: string | undefined) => {

    Swal.fire({
      title: text,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })
  }

}
