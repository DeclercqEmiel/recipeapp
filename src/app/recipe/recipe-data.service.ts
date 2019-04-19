import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Observable, Subject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeDataService {
  public loadingError$ = new Subject<string>();

  constructor(private http: HttpClient) {}

  get recipes$(): Observable<Recipe[]> {
    return this.http.get(`${environment.apiUrl}/recipes/`).pipe(
      catchError(error => {
        this.loadingError$.next(error.statusText);
        return of(null);
      }),
      map((list: any[]): Recipe[] => list.map(Recipe.fromJSON))
    );
  }

  addNewRecipe(recipe: Recipe) {
    return this.http.post(`${environment.apiUrl}/recipes/`, recipe.toJSON());
  }

  getRecipe$(id): Observable<Recipe> {
    return this.http
      .get(`${environment.apiUrl}/recipes/${id}`)
      .pipe(map((rec: any): Recipe => Recipe.fromJSON(rec)));
  }

  updateRecipe(recipe: Recipe) {
    return this.http
      .put(`${environment.apiUrl}/recipes/${recipe.id}`, recipe.toJSON())
      .pipe();
  }

  getRecipes$(name?: string, chef?: string, ingredient?: string) {
    console.log(`getRecipes request with ${name}`);
    let params = new HttpParams();
    params = name ? params.append('name', name) : params;
    params = chef ? params.append('chef', chef) : params;
    params = ingredient ? params.append('ingredientName', ingredient) : params;
    return this.http.get(`${environment.apiUrl}/recipes/`, { params }).pipe(
      catchError(error => {
        this.loadingError$.next(error.statusText);
        return of(null);
      }),
      map((list: any[]): Recipe[] => list.map(Recipe.fromJSON))
    );
  }
}
