import { Ingredient } from './ingredient.model';

export class Recipe {
  private _id: number;

  constructor(
    private _name: string,
    private _chef: string,
    private _ingredients = new Array<Ingredient>(),
    private _dateAdded = new Date()
  ) {}

  static fromJSON(json: any): Recipe {
    const rec = new Recipe(
      json.name,
      json.chef,
      json.ingredients.map(Ingredient.fromJSON),
      json.created
    );
    rec._id = json.id;
    return rec;
  }
  toJSON(): any {
    return {
      id: this._id,
      name: this.name,
      chef: this._chef,
      ingredients: this.ingredients.map(ing => ing.toJSON()),
      created: this.dateAdded
    };
  }
  get id(): number {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get chef(): string {
    return this._chef;
  }
  set chef(newChef: string) {
    this._chef = newChef;
  }
  get dateAdded(): Date {
    return this._dateAdded;
  }
  get ingredients(): Ingredient[] {
    return this._ingredients;
  }
  addIngredient(name: string, amount?: number, unit?: string) {
    this._ingredients.push(new Ingredient(name, amount, unit));
  }
}
