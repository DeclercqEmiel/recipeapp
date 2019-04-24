import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeDataService } from '../recipe-data.service';
import { RatingComponent } from 'src/app/rating/rating.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  @Input() public recipe: Recipe;

  constructor(private _recipeDataService: RecipeDataService) {}

  ngOnInit() {}

  adjustRating(clickObj: any): void {
    this.recipe.rating = clickObj.rating;
    this._recipeDataService.rateRecipe(this.recipe, clickObj.rating).subscribe(
      newRating => {
        this.recipe.rating = newRating;
      },
      () => {
        this.recipe.rating = 0;
      }
    );
  }
}
