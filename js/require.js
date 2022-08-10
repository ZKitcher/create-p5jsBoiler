const urlTree = [
    {
        baseURL: 'NeuralNetwork',
        extension: 'js',
        endpoint: [
            'math',
            'neuralNetwork',
            'population',
            'quadtree',
        ]
    },
    {
        baseURL: 'js/classes',
        extension: 'js',
        endpoint: [
            /* Class names here */
            'entity',
            'ship',
            'missile',
            'asteroid',
            'room',
        ]
    },
    {
        baseURL: 'js/scripts',
        extension: 'js',
        endpoint: [
            'main'
        ]
    }
]

urlTree.forEach(e => {
    e.endpoint.forEach(endpoint => {
        var script = document.createElement('script')
        script.src = `${e.baseURL}/${endpoint}.${e.extension}`
        document.head.appendChild(script)
    })
})
