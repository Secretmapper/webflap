export default [
  {
    selector: 'node',
    style: {
      'background-color': 'white',
      'background-image': 'url(assets/circle.svg)',
      'border-color': 'black',
      'border-width': 1,
      color: 'black',
      content: 'data(label)',
      height: 50,
      'text-valign': 'center',
      width: 50
    }
  },
  {
    selector: 'node.dfa__state--final',
    style: {
      'background-fit': 'cover',
      'background-image': 'url(assets/circle.svg)'
    }
  },
  {
    selector: 'node.dfa__state--initial',
    style: {
      'border-color': 'blue'
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
    selector: 'edge.autorotate',
    style: {
      'edge-text-rotation': 'autorotate'
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
