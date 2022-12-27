import { Injectable } from '@angular/core';

/**
 * Generic writeable app settings.
 */
@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  public termDistrNames: string[];
  public termiDistrLimit: number;
  public termDistrInterval: number;
  public presetTermDistrLimits: number[];
  public presetTermDistrIntervals: number[];
  public termDistrDocNames: string[];
  public termDistrOccNames: string[];

  constructor() {
    this.termDistrNames = [];
    this.termiDistrLimit = 10;
    this.termDistrInterval = 5;
    this.presetTermDistrLimits = [3, 5, 10, 25, 50];
    this.presetTermDistrIntervals = [0, 5, 10, 25, 50, 100];
    this.termDistrDocNames = [];
    this.termDistrOccNames = [];
  }
}
