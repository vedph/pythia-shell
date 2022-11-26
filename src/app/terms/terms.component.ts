import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css'],
})
export class TermsComponent {
  constructor(private _router: Router) {}

  public requestSearch(term: string): void {
    this._router.navigate(['search', term]);
  }
}
