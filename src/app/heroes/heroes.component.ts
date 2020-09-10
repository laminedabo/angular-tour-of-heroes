import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  // hero: Hero = {
  //   id: 1,
  //   name: 'Windstorm'
  // };
  heroes: Hero[]; //la collection de heros

  constructor(private heroService: HeroService, private messageService: MessageService) { }

  getHeroes(): void{
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  ngOnInit() {
    this.getHeroes();
  }

  add(name: string): void{
    name = name.trim();
    if (!name) {
      return
    }
    this.heroService.addHero({ name } as Hero)
    .subscribe(hero => {this.heroes.push(hero);
    })
  }

  delete(hero: Hero): void{
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

  //Desormais non utilisé<
  selectedHero: Hero;
  onSelect(hero: Hero): void{
    this.selectedHero = hero;
    this.messageService.add(`Vous avez séléctionné l'héro n° ${hero.id}`);
  }
  //Desormais non utilisé>

}