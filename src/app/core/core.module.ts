import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { MainComponent } from './layouts/main/main.component';
import { MenuComponent } from './layouts/menu/menu.component';
import { TopBarComponent } from './layouts/top-bar/top-bar.component';
import { HomeComponent } from './layouts/home/home.component';
import { LibModule } from '../lib/lib.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [MainComponent, MenuComponent, TopBarComponent, HomeComponent],
  imports: [CommonModule, CoreRoutingModule, LibModule, HttpClientModule],
})
export class CoreModule {}
