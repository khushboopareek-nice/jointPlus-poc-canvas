import { Component, ViewEncapsulation } from '@angular/core';
import * as joint from '@joint/plus/joint-plus';
import workflowTasks from '../../workflow-tasks.json';

@Component({
  selector: 'app-workflow',
  imports: [],
  templateUrl: './workflow.component.html',
  styleUrl: './workflow.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class WorkflowComponent {
  public workflowTasks=workflowTasks;

  public ngAfterViewInit() {
    const graph = new joint.dia.Graph();
    const paper = new joint.dia.Paper({
        el: document.getElementById('paper'),
        model: graph,
        width: 5000,
        height: 2000,
        gridSize: 10,
        drawGrid: true
    });

    // Create elements
    const elements = {};
    Object.keys(this.workflowTasks.t).forEach(taskId => {
        const task = this.workflowTasks.t[taskId];
        let element;

        // Determine the shape based on the task type
        switch (task.n) {
            case 'Start': // Example task type
                element = new joint.shapes.standard.Rectangle();
                element.resize(100, 40);
                element.attr({
                    body: { fill: 'lightblue' },
                    label: { text: task.i, fill: 'black' }
                });
                break;

            case 'simple': // Another task type
                element = new joint.shapes.standard.Circle();
                element.resize(50, 50);
                element.attr({
                    body: { fill: 'lightgreen' },
                    label: { text: task.i, fill: 'black' }
                });
                break;

            case 'Decision': // Custom shape for a specific task type
                element = new joint.shapes.standard.Polygon();
                element.resize(100, 60);
                element.attr({ 
                    body: { fill: 'orange', refPoints: '50,0 100,50 50,100 0,50'},
                    label: { text: task.i, fill: 'black' }
                });
                break;

            default: // Default shape
                element = new joint.shapes.standard.Rectangle();
                element.resize(100, 60);
                element.attr({
                    body: { fill: 'gray' },
                    label: { text: task.i, fill: 'white' }
                });
                break;
        }

        // Set position and add to graph
        element.position(task.p.x, task.p.y);
        element.addTo(graph);

        // Store the element for later use (e.g., for linking)
        elements[taskId] = element;
    });

    // Debugging: Log elements
    console.log('Elements:', elements);

    // Create links
    this.workflowTasks.c.forEach(connection => {
        const sourceElement = elements[connection.s];
        const targetElement = elements[connection.t];

        if (sourceElement && targetElement) {
            const link = new joint.shapes.standard.Link();
            link.source({ id: sourceElement.id }); // Pass an object with the id
            link.target({ id: targetElement.id }); // Pass an object with the id
            link.addTo(graph); // Add the link to the graph
        } else {
            console.error(`Invalid source or target for connection:`, connection);
        }
    });

    // Debugging: Log connections
    console.log('Connections:', graph);
    
    const graphJSON = graph.toJSON(); // Serialize the graph model
    const graphJSONString = JSON.stringify(graphJSON); // Convert to JSON string
    const sizeInBytes = new Blob([graphJSONString]).size; // Calculate size in bytes
    const sizeInKB = sizeInBytes / 1024; // Convert to kilobytes
     
    console.log(`Workflow size: ${sizeInKB.toFixed(2)} KB`);
}
}
