import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  public initialQueryTerm: string | undefined;

  constructor(route: ActivatedRoute) {
    if ('term' in route.snapshot.params) {
      this.initialQueryTerm = route.snapshot.params['term'];
    }
  }
}
