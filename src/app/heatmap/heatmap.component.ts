import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as joint from '@joint/plus';

@Component({
  selector: 'app-heatmap-graph',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class HeatmapComponent implements AfterViewInit{

  ngAfterViewInit() {
    
  const { dia, shapes } = joint;

  // Paper

  const paperContainer = document.getElementById("paper-container");
  if (!paperContainer) return; // Prevent errors if container is missing

  const graph = new dia.Graph({}, { cellNamespace: shapes });
  const paper = new dia.Paper({
    model: graph,
    cellViewNamespace: shapes,
    width: "100%",
    height: "100%",
    gridSize: 20,
    drawGrid: { name: "mesh" },
    async: true,
    sorting: dia.Paper.sorting.APPROX,
    background: { color: "#F3F7F6" }
  });

  paperContainer.appendChild(paper.el);

  const defaultCounterVal = 1;
/* 
  var highlight = el.clone();
    highlight.translate(540, 100);
    highlight.attr({
        body: {
            filter: {
                name: 'highlight',
                args: {
                    color: 'red',
                    width: 2,
                    opacity: 0.5,
                    blur: 5
                }
            }
        },
    });
    highlight.addTo(graph); */
    const highlightColor= {   
              filter: {
                name: 'highlight',
                args: {
                    color: 'red',
                    width: 20,
                    opacity: 0.5,
                    blur: 50
                }
            }};
  const color = "#0057FF";
  const gradientcolor = {
          type: "linearGradient",
          stops: [
            { offset: 0, color: "#1f005c" },
            { offset: 0.14285714285714285, color: "#5b0060" },
            { offset: 0.2857142857142857, color: "#870160" },
            { offset: 0.42857142857142855, color: "#ac255e" },
            { offset: 0.5714285714285714, color: "#ca485c" },
            { offset: 0.7142857142857142, color: "#e16b5c" },
            { offset: 0.8571428571428571, color: "#f39060" },
            { offset: 1, color: "#ffb56b" }
          ]
        } ;
  const errorColor = "#FF0000";

  const CounterHighlighter =joint.dia.HighlighterView.extend({
    UPDATE_ATTRIBUTES: ["counter"],
    tagName: "g",
    children: [
      {
        tagName: "rect",
        selector: "background",
        attributes: {
          x: -10,
          y: -10,
          rx: 10,
          ry: 10,
          height: 20,
          "stroke-width": 10,
        },
      },
      {
        tagName: "text",
        selector: "label",
        attributes: {
          x: 0,
          y: ".3em",
          fill: "#fff",
          "font-size": 11,
          "font-family": "monospace",
        }
      }
    ],
    highlight: function (cellView) {
      this.renderChildren();
      const { background, label } = this.childNodes;
      const { model, el } = cellView;
      const counter = model.get("counter");
      const [body] = cellView.findBySelector("body");

      // Ensure the gradient is defined in the SVG defs
      const svg = cellView.paper.svg;
      let defs = svg.querySelector('defs');
      if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.insertBefore(defs, svg.firstChild);
      }
      let gradient = svg.querySelector('#counter-gradient');
      if (!gradient) {
        gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        gradient.setAttribute('id', 'counter-gradient');
        gradient.setAttribute('cx', '50%');
        gradient.setAttribute('cy', '50%');
        gradient.setAttribute('r', '50%'); // Increased radius from 50% to 80%
        [
            { offset: '0%', color: '#1f005c' },
            { offset: '14%', color: '#5b0060' },
            { offset: '29%', color: '#870160' },
            { offset: '43%', color: '#ac255e' },
            { offset: '57%', color: '#ca485c' },
            { offset: '71%', color: '#e16b5c' },
            { offset: '86%', color: '#f39060' },
            { offset: '100%', color: '#ffb56b' }
        ].forEach(stop => {
          const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
          stopEl.setAttribute('offset', stop.offset);
          stopEl.setAttribute('stop-color', stop.color);
          gradient.appendChild(stopEl);
        });
        defs.appendChild(gradient);
      }

      if (counter == 0) {
        background.setAttribute("width", 100);
        background.setAttribute("fill", errorColor);
        background.setAttribute("stroke", errorColor);
        label.setAttribute("text-anchor", "start");
        label.textContent = "Out of Stock";
        if (body) {
          body.style.stroke = errorColor;
        }
      } else {
        background.setAttribute("width", 20);
        background.setAttribute("fill", "#000");
        background.setAttribute("stroke", "url(#counter-gradient)"); // Radial gradient for border
        background.setAttribute("stroke-width", 40);
        label.setAttribute("text-anchor", "middle");
        label.textContent = counter;
        if (body) {
          body.style.stroke = '';
        }
      }
    }
  });

  const rect = new joint.shapes.standard.Rectangle({
    size: { width: 100, height: 100 },
    position: { x: 100, y: 100 },
    counter: defaultCounterVal,
    attrs: {
      body: {
        strokeWidth: 4,
      }
    }
  });

  rect.addTo(graph);

  CounterHighlighter.add(rect.findView(paper), "root", "links");

  }
}