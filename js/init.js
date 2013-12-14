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
        coreX: 35,
        coreY: 14,
        spawns: [
            { x: -1, y: 10 },
            { x: -1, y: 20 }
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