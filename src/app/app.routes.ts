import { Routes } from '@angular/router';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { HeatmapComponent } from './heatmap/heatmap.component';

export const routes: Routes = [
    { path: '', redirectTo: 'workflow', pathMatch: 'full'},    // Default route (home)
    { path: 'workflow', component: WorkflowComponent  }, // About page
    { path: 'dragDrop', component: DragDropComponent  }, // About page
    {path :'heatmap',component:HeatmapComponent}, // About page
  ];