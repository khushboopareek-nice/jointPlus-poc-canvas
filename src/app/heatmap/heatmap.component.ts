import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as joint from '@joint/plus';
import { Transform } from 'stream';

@Component({
  selector: 'app-heatmap-graph',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class HeatmapComponent implements AfterViewInit {
  ngAfterViewInit() {
    const { dia, shapes } = joint;

    // Paper

    const paperContainer = document.getElementById('paper-container');
    if (!paperContainer) return; // Prevent errors if container is missing

    const graph = new dia.Graph({}, { cellNamespace: shapes });
    const paper = new dia.Paper({
      model: graph,
      cellViewNamespace: shapes,
      width: '100%',
      height: '100%',
      gridSize: 20,
      drawGrid: { name: 'mesh' },
      async: true,
      sorting: dia.Paper.sorting.APPROX,
      background: { color: '#F3F7F6' },
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
    const highlightColor = {
      filter: {
        name: 'highlight',
        args: {
          color: 'red',
          width: 20,
          opacity: 0.5,
          blur: 50,
        },
      },
    };
    const color = '#0057FF';
    const gradientcolor = {
      type: 'linearGradient',
      stops: [
        { offset: 0, color: '#1f005c' },
        { offset: 0.14285714285714285, color: '#5b0060' },
        { offset: 0.2857142857142857, color: '#870160' },
        { offset: 0.42857142857142855, color: '#ac255e' },
        { offset: 0.5714285714285714, color: '#ca485c' },
        { offset: 0.7142857142857142, color: '#e16b5c' },
        { offset: 0.8571428571428571, color: '#f39060' },
        { offset: 1, color: '#ffb56b' },
      ],
    };
    const errorColor = '#FF0000';

    const CounterHighlighter = joint.dia.HighlighterView.extend({
      UPDATE_ATTRIBUTES: ['counter'],
      tagName: 'g',
      children: [
        {
          tagName: 'rect',
          selector: 'background',
          attributes: {
            x: 3,
            y: 0,
            rx: 20,
            ry: 10,
            height: 20,
            'stroke-width': 10,
          },
        },
        {
          tagName: 'text',
          selector: 'label',
          attributes: {
            x: 13,
            y: '1.3em',
            fill: '#fff',
            'font-size': 11,
            'font-family': 'monospace',
          },
        },
      ],
      highlight: function (cellView) {
        this.renderChildren();
        const { background, label } = this.childNodes;
        const { model } = cellView;
        const counter = model.get('counter');
        const [body] = cellView.findBySelector('body');

        // Ensure the gradient is defined in the SVG defs
        const svg = cellView.paper.svg;
        let defs = svg.querySelector('defs');
        if (!defs) {
          defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
          svg.insertBefore(defs, svg.firstChild);
        }
        let gradient = svg.querySelector('#counter-gradient');
        gradient = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'radialGradient'
        );
        gradient.setAttribute('id', 'counter-gradient');
        gradient.setAttribute('cx', '50%');
        gradient.setAttribute('cy', '50%');
        if (counter > 100) {
          gradient.setAttribute('color', '#3671D9');
          gradient.setAttribute('r', '100%'); // Increased radius from 50% to 80%
          [
            { offset: '0%', opacity: '1' },
            { offset: '75%', opacity: '0.85' },
            { offset: '100%', opacity: '0.25' },
          ].forEach((stop) => {
            const stopEl = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'stop'
            );
            stopEl.setAttribute('offset', stop.offset);
            stopEl.setAttribute('stop-color', '#3671D9');
            stopEl.setAttribute('stop-opacity', stop.opacity);
            gradient.appendChild(stopEl);
            background.setAttribute('stroke-width', 60);
          });
        } else if (counter > 0 && counter <= 100) {
          gradient.setAttribute('color', '#3671D9');
          gradient.setAttribute('r', '80%'); // Increased radius from 50% to 80%
          [
            { offset: '0%', opacity: '0.25' },
            { offset: '57%', opacity: '0.25' },
            { offset: '100%', opacity: '0' },
          ].forEach((stop) => {
            const stopEl = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'stop'
            );
            stopEl.setAttribute('offset', stop.offset);
            stopEl.setAttribute('stop-color', '#3671D9');
            stopEl.setAttribute('stop-opacity', stop.opacity);
            gradient.appendChild(stopEl);
            background.setAttribute('stroke-width', 40);
          });
        } else {
          gradient.setAttribute('r', '50%'); // Increased radius from 50% to 80%
          [
            { offset: '0%', opacity: '0.25' },
            { offset: '100%', opacity: '0.25' },
          ].forEach((stop) => {
            const stopEl = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'stop'
            );
            stopEl.setAttribute('offset', stop.offset);
            stopEl.setAttribute('stop-color', stop.opacity);
            gradient.appendChild(stopEl);
          });
        }
        defs.appendChild(gradient);

        if (counter == 0) {
          background.setAttribute('width', 100);
          background.setAttribute('fill', errorColor);
          background.setAttribute('stroke', errorColor);
          label.setAttribute('text-anchor', 'start');
          label.textContent = 'Out of Stock';
          if (body) {
            body.style.stroke = errorColor;
          }
        } else {
          background.setAttribute('width', 20);
          background.setAttribute('fill', '#000');
          background.setAttribute('stroke', 'url(#counter-gradient)'); // Radial gradient for border
          label.setAttribute('text-anchor', 'middle');
          label.textContent = counter;
          if (body) {
            body.style.stroke = '';
          }
        }
      },
    });

    const rect = new shapes.standard.Cylinder({
      size: { width: 25, height: 100 },
      position: { x: 100, y: 75 },
      counter: 222,
    });
    const rect2 = new shapes.standard.Cylinder({
      size: { width: 25, height: 100 },
      position: { x: 300, y: 75 },
      counter: 85,
    });
    const rect3 = new shapes.standard.Cylinder({
      size: { width: 25, height: 100 },
      position: { x: 500, y: 75 },
      counter: 0,
    });

    rect.addTo(graph);
    rect2.addTo(graph);
    rect3.addTo(graph);

    CounterHighlighter.add(rect.findView(paper), 'root', 'links');
    CounterHighlighter.add(rect2.findView(paper), 'root', 'links');
    CounterHighlighter.add(rect3.findView(paper), 'root', 'links');

    const cylinders = [rect, rect2, rect3];

    // Connect the cylinders with links
    for (let i = 0; i < cylinders.length - 1; i++) {
      const link = new shapes.standard.Link({
        source: { id: cylinders[i].id },
        target: { id: cylinders[i + 1].id },
        attrs: {
          line: {
            stroke: '#0057FF',
            strokeWidth: 2,
            targetMarker: {
              type: 'path',
              d: 'M 10 -5 0 0 10 5 z',
              fill: '#0057FF',
            },
          },
        },
      });
      link.addTo(graph);
    }

    function addHeatmapHighlight(svg: SVGSVGElement, node: any, counter: number) {
      let defs = svg.querySelector('defs');
      if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.insertBefore(defs, svg.firstChild);
      }
      // Remove any previous gradients for this node
      const gradientId = `counter-gradient-${node.id}`;
      let gradient = svg.querySelector(`#${gradientId}`);
      if (gradient) {
        while (gradient.firstChild) gradient.removeChild(gradient.firstChild);
      } else {
        gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        gradient.setAttribute('id', gradientId);
        gradient.setAttribute('cx', '50%');
        gradient.setAttribute('cy', '50%');
        gradient.setAttribute('r', '90%');
        defs.appendChild(gradient);
      }
      // Multi-stop blue gradient like the image
      let opacity = 0.3;
      if (counter.toString().length === 2) opacity = 0.5;
      if (counter.toString().length >= 3) opacity = 0.7;
      [
        { offset: '0%', color: `rgba(0,87,255,${opacity})` },
        { offset: '30%', color: `rgba(0,87,255,${opacity * 0.6})` },
        { offset: '60%', color: `rgba(0,87,255,${opacity * 0.3})` },
        { offset: '100%', color: 'rgba(0,87,255,0)' }
      ].forEach(stop => {
        const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stopEl.setAttribute('offset', stop.offset);
        stopEl.setAttribute('stop-color', stop.color);
        gradient.appendChild(stopEl);
      });
      // Add a highlight ellipse below the node
      const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      highlight.setAttribute('cx', String(node.position().x + node.size().width / 2));
      highlight.setAttribute('cy', String(node.position().y + node.size().height / 2));
      highlight.setAttribute('rx', String(node.size().width * 1.5 / 2));
      highlight.setAttribute('ry', String(node.size().height * 1.5 / 2));
      highlight.setAttribute('fill', `url(#${gradientId})`);
      highlight.setAttribute('pointer-events', 'none');
      highlight.setAttribute('style', 'z-index:0;');
      svg.insertBefore(highlight, svg.firstChild.nextSibling);
    }

    // Usage example after adding each node:
    //addHeatmapHighlight(paper.svg, rect, rect.get('counter'));
    //addHeatmapHighlight(paper.svg, rect2, rect2.get('counter'));
    //addHeatmapHighlight(paper.svg, rect3, rect3.get('counter'));
  }
}

