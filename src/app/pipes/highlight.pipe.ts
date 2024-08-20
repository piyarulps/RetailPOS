import { Pipe, PipeTransform } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'

@Pipe({
	name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
	constructor(
		private _sanitizer: DomSanitizer
	) { }

	transform(value: any, args?: any): any {
		if (typeof value != 'undefined') {
			value = value.replace(' ', '&nbsp;');
			if (!args) {
				return value;
			}
			const re = new RegExp(args, 'gi');
			const match = value.match(re);
			if (!match) {
				return value;
			}
			const replacedValue = value.replace(re, "<strong>" + match[0] + "</strong>")
			return this._sanitizer.bypassSecurityTrustHtml(replacedValue)
		}
		return value;
	}

}
