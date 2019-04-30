import { AuthenticationService } from './../../user/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { RecipeDataService } from '../recipe-data.service';
import { Observable, Subject } from 'rxjs';
import { Recipe } from '../recipe.model';
import {
  distinctUntilChanged,
  debounceTime,
  map,
  switchMap
} from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  public filterRecipeName: string = '';
  public filterRecipe$ = new Subject<string>();

  public recipes: Recipe[];
  private _fetchRecipes$: Observable<Recipe[]> = this._recipeDataService
    .recipes$;
  public loadingError$ = this._recipeDataService.loadingError$;

  constructor(
    private _recipeDataService: RecipeDataService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.filterRecipe$
      .pipe(
        distinctUntilChanged(),
        debounceTime(250)
      )
      .subscribe(val => {
        // create a parameter object with a filter property and navigate to that url
        // e.g. /recipe/list?filter=sp
        // don't do any filtering here, that happens when we process this new url
        const params = val ? { queryParams: { filter: val } } : undefined;
        this._router.navigate(['/recipe/list'], params);
      });

    this._route.queryParams
      .pipe(
        switchMap(newParams => {
          // set the value of the input field with the url parameter as well
          if (newParams['filter']) {
            this.filterRecipeName = newParams['filter'];
          }
          // when the queryparameter changes, take the filter parameter and use it to ask
          // the service for all recipes with this filter in their name
          // this._recipeDataService.getRecipes$(params['filter']).subscribe(
          return this._recipeDataService.getRecipes$(newParams['filter']);
        })
      )
      .subscribe(val => {
        this.recipes = val;
        // once the recipes are received, we ask for all the ratings of these recipes
        // and update the recipes with them
        this._recipeDataService
          .getRecipeRatings(this.recipes)
          .subscribe((ratingList: any[]) => {
            for (const oneRating of ratingList) {
              const { id, rating } = oneRating;
              this.recipes.find(rec => rec.id === id).rating = rating;
            }
          });
      });
  }
}
