export default [
  {
    selector: 'node',
    style: {
      'background-color': 'white',
      'border-color': 'black',
      'border-width': 1,
      color: 'black',
      content: 'data(label)',
      'text-valign': 'center',
      height: 50,
      width: 50
    }
  },
  {
    selector: '.autorotate',
    style: {
      'edge-text-rotation': 'autorotate'
    }
  },
  {
    selector: 'edge',
    style: {
      label: 'data(label)',
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      width: '1',
      'text-background-color': 'white',
      'text-background-opacity': '1',
      'text-background-shape': 'rectangle'
    }
  },
  {
    selector: '.eh-handle',
    style: {
      'background-color': 'red',
      width: 12,
      height: 12,
      shape: 'ellipse',
      'overlay-opacity': 0,
      'border-width': 12, // makes the handle easier to hit
      'border-opacity': 0
    }
  },
  {
    selector: '.eh-hover',
    style: {
      'background-color': 'red'
    }
  },
  {
    selector: '.eh-source',
    style: {
      'border-width': 2,
      'border-color': 'red'
    }
  },
  {
    selector: '.eh-target',
    style: {
      'border-width': 2,
      'border-color': 'red'
    }
  },
  {
    selector: '.eh-preview, .eh-ghost-edge',
    style: {
      'background-color': 'red',
      'line-color': 'red',
      'target-arrow-color': 'red',
      'source-arrow-color': 'red'
    }
  },
  {
    selector: '.eh-ghost-edge.eh-preview-active',
    style: {
      opacity: 0
    }
  }
]
