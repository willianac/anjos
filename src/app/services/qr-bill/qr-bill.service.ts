import { Injectable } from "@angular/core";

@Injectable()
export class QrBillService {
	private QRCodeBillSource;

	public setBillSource(source: any) {
		this.QRCodeBillSource = source;
	}

	public getBillSource() {
		return this.QRCodeBillSource;
	}
}