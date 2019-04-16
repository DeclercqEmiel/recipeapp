import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RecipeDataService } from '../recipe-data.service';
import { Observable, Subject } from 'rxjs';
import { Recipe } from '../recipe.model';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';

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
        const params = val ? { queryParams: { filter: val } } : undefined;
        this._router.navigate(['/recipe/list'], params);
      });

    this._route.queryParams.subscribe(params => {
      this._recipeDataService
        .getRecipes$(params['filter'])
        .subscribe(val => (this.recipes = val));
      if (params['filter']) {
        this.filterRecipeName = params['filter'];
      }
    });
  }
}
