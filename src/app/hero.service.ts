import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private http:HttpClient, private messageService: MessageService) { }

  private heroesUrl = 'api/heroes';

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('héros recupérés')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      )
  }

  private log(message: string){
    this.messageService.add(`HeroService: ${message}`);
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`Les détails du héro n° ${id}`)),
      catchError(this.handleError<Hero>(`getHero id = ${id}`))
    )
  }

  /* GET recherche par terme */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      //si aucune recherche n'est faite.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
          this.log(`résultats pour "${term}"`) :
          this.log(`pas de résultat pour "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  /** GET hero by id. Return `intouvable` au lieu de 404 si non trouvé */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `trouvé` : `intouvable`;
          this.log(`hero id=${id} ${outcome}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put<any>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`mise à jour héro ${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`héro ajouté: id = ${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
  
  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`héro supprimé: id = ${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /**
   * Gérer l'opération Http qui a échoué.
   * continuer l'exécution de l'application.
   * @param operation - nom de l'opération qui a échoué
   * @param result - valeur optionnelle à retourner en tant que observable
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // afficher dans le condole

      // TODO: Afficher les erreurs à l'utilisateur
      this.log(`${operation} a échoué: ${error.message}`);

      // continuier l'exécution de l'app en retournant un tableau vide.
      return of(result as T);
    };
  }
}
