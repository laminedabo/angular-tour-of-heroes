import { Component, OnInit } from '@angular/core';
import { Observable, Subject, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>;
  private seachTerms= new Subject<string>();


  constructor( private heroService: HeroService ) { }

  search(term: string): void{
    this.seachTerms.next(term)
  }

  ngOnInit(): void {
    this.heroes$ = this.seachTerms.pipe(
      debounceTime(300),//attente de 300ms apres l'entrée d'un caractère
      distinctUntilChanged(),
      //passer à une nouvelle recherche (observable) chaque fois que le terme change
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }

}
