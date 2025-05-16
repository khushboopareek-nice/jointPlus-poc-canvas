import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WorkflowComponent } from './workflow/workflow.component';

export const routes: Routes = [
    { path: '',component: AppComponent },    // Default route (home)
    { path: 'workflow', component: WorkflowComponent  }, // About page
    { path: 'dragDrop', component: DragDropComponent  }, // About page
  ];
  @NgModule({
    imports: [
      AppComponent,
      BrowserModule,
      RouterModule.forRoot(routes) // Import the RouterModule with routes configuration
    ],
    exports: [RouterModule],
    providers: [],
  })
  export class AppModule { }