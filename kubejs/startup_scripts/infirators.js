onEvent('block.registry', event => {
    event.create('infirators:infirator', 'stone_button')
        .material('slime')
        .hardness(1)
        .resistance(999999)
        .displayName('InfiRator')
        .noDrops()
        .speedFactor(1.5)

    event.create('infirators:infiratorrator', 'wall')
        .material('slime')
        .hardness(8)
        .resistance(999999)
        .displayName('InfiRatorRator')
        .jumpFactor(5)
    
    event.create('infirators:infiratorrator_recharging')
        .material('slime')
        .unbreakable()
        .displayName('InfiRatorRator')
        .jumpFactor(5)
        .box(6, 0, 6, 10, 16, 10, true)
        .randomTick(tick => {
            if(tick.random.nextFloat() < 0.05) {
                tick.block.set('infirators:infiratorrator')
            }
        })


    for(let inf of [["down", [0, 0, 0, 16, 8, 16]], ["up", [0, 8, 0, 16, 16, 16]], ["north", [0, 0, 0, 16, 16, 8]], ["south", [0, 0, 8, 16, 16, 16]], ["west", [0, 0, 0, 8, 16, 16]], ["east", [8, 0, 0, 16, 16, 16]]]) {
        event.create('infirators:infirotator_'+inf[0])
            .material('slime')
            .hardness(1)
            .resistance(999999)
            .displayName('InfiRotator')
            .noDrops()
            .box(inf[1][0], inf[1][1], inf[1][2], inf[1][3], inf[1][4], inf[1][5], true)
            .speedFactor(0)
            .randomTick(tick => {
                if(tick.random.nextFloat() < 0.20) {
                    sides = ["down", "up", "north", "south", "west", "east"]
                    sides.splice(sides.indexOf(inf[0]), 1)
                    tick.block.set('infirators:infirotator_'+sides[Math.floor(Math.random()*sides.length)])
                    if(tick.server.persistentData[tick.block.dimension]["infirators"] != undefined)
                        tick.server.persistentData[tick.block.dimension]["infirators"][`${tick.block.pos.x} ${tick.block.pos.y} ${tick.block.pos.z}`] = undefined
                }
            })
    }
})