import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, timer } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {

  beginnersCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {}

  ngOnInit() {
    const http$: Observable<Course[]> = createHttpObservable(
      "https://httprequeststudy-default-rtdb.firebaseio.com/server.json"
    );
    const courses$ = http$.pipe(
      tap(()=> {
        console.log('http request executed')
      }),
      map(courses => {
        return courses['courses']
      }),
      shareReplay()
      )

    this.beginnersCourses$ = courses$.pipe(
      tap(console.log),
      map(
        courses =>{

          return courses.filter(course => course.category == 'BEGINNER')
          }
      )
    )

    this.advancedCourses$ = courses$.pipe(
      map(
        courses => courses.filter(course => course.category == 'ADVANCED')
      )
    )

    // users.subscribe((courses) => {
    //   this.beginnersCourses = courses.filter(course => course.category == 'BEGINNER')
    //   this.advancedCourses = courses.filter(course => course.category == 'ADVANCED')
    // });
  }
}
