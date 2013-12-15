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
        name: '1',
        url: 'assets/m01.json',
        coreX: 28,
        coreY: 14,
        spawns: [
            {x: -1, y: 8},
            {x: -1, y: 13},
            {x: -1, y: 17},
            {x: -1, y: 22}
        ]
    },
    {
        name: '2',
        url: 'assets/m02.json',
        coreX: 20,
        coreY: 15,
        spawns: [
            {x: -1, y: 13},
            {x: -1, y: 14},
            {x: -1, y: 15},
            {x: -1, y: 16},
            {x: -1, y: 17},
            {x: -1, y: 18},
            {x: -1, y: 19}
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