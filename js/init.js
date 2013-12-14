var yogo = yogo || {};

yogo.spriteList = [
    { name: 'loading2', url: 'assets/loading.png' },
    { name: 'tileset', url: 'assets/tileset.png' },
    { name: 'enemy1', url: 'assets/enemy1.png' },
    { name: 'tower1', url: 'assets/tower1.png' },
    { name: 'cursor', url: 'assets/cursor.png' },
    { name: 'core', url: 'assets/core.png' }
];

yogo.mapList = [
    {
        name: '01',
        url: 'assets/m01.json',
        coreX: 29,
        coreY: 14,
        spawns: [
            {x: -1, y: 5, queue: [
                {time: 0, name: 'enemy1'},
                {time: 1, name: 'enemy1'},
                {time: 2, name: 'enemy1'},
                {time: 3, name: 'enemy1'},
                {time: 4, name: 'enemy1'},
                {time: 14, name: 'enemy1'},
                {time: 15, name: 'enemy1'},
                {time: 16, name: 'enemy1'}
            ]},
            { x: -1, y: 24, queue: [
                {time: 4, name: 'enemy1'},
                {time: 5, name: 'enemy1'},
                {time: 6, name: 'enemy1'},
                {time: 7, name: 'enemy1'},
                {time: 8, name: 'enemy1'},
                {time: 18, name: 'enemy1'},
                {time: 19, name: 'enemy1'},
                {time: 20, name: 'enemy1'}
            ]}
        ]
    }
];

var vendors = [
    'ms',
    'moz',
    'webkit',
    'o'
];

for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++)
{
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
}