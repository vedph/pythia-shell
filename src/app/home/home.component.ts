import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public query?: string;

  constructor() {}

  ngOnInit(): void {}

  public onQueryChange(query: string): void {
    this.query = query;
  }
}
