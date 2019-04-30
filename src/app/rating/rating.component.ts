// loosely based on code found in this plnkr (without author or source mentioned) http://embed.plnkr.co/Qi6tEdIyaRoGgSj2z4M9
//
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-rating',
  templateUrl: 'rating.component.html',
  styleUrls: ['rating.component.css']
})
export class RatingComponent {
  @Input() rating: number;
  public ratingChange$ = new Subject<number>();

  onClick(rating: number): void {
    this.rating = rating;
    this.ratingChange$.next(this.rating);
  }
}
