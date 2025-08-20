import { Component, inject } from '@angular/core';
import { routes } from '../../../app.routes';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  router = inject(Router);

  routes = routes
    .filter((x) => x.path !== '**')
    .map((x) => ({
      path: x.path,
      title: `${x.title ?? 'Maps using Angular'}`,
    }));

  pageTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.url),
      map((url) => routes.find((x) => `/${x.path}` === url)?.title ?? 'Maps')
    )
  );
}
