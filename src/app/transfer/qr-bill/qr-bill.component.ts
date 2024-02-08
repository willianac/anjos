import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { QrBillService } from "app/services/qr-bill/qr-bill.service";

@Component({
	selector: "qrBill",
	templateUrl: "qr-bill.component.html",
	styleUrls: ["qr-bill.component.scss"]
})
export class QrBillComponent implements OnInit, AfterViewInit {
	private qrBillSource;

	constructor(
		private qrBillService: QrBillService, 
		private renderer: Renderer2, 
		private elem: ElementRef, 
		private router: Router
	) {}

	ngOnInit(): any {
		this.qrBillSource = this.qrBillService.getBillSource()
		if(!this.qrBillSource) {
			return this.router.navigate(["admin", "transfer", "payment"])
		}
	}

	ngAfterViewInit(): void {
		if(!this.qrBillSource) return
		
		// const source = this.qrBillService.getBillSource()
		// const iframe = this.elem.nativeElement.querySelector("#iframe")
		// this.renderer.setAttribute(iframe, "src", source)
		
		const source = this.qrBillService.getBillSource()
		const iframe = this.elem.nativeElement.querySelector("#svg-container")
		iframe.innerHTML = source
	}
}