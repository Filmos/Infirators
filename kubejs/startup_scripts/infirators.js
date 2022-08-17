function create_block_base(event, name, type) {
    let display_name = name.split('_')[0]
    let coloring_regexes = [
        /^(Infi)(.*)(Rator)$/,
        /^(InfiRa)(.*)(tor)$/,
        /^(InfiRato)(.*)(r)$/,
        /^(InfiRat)(.*)(or)$/,
        /^(InfiR)(.*)(ator)$/,
    ]
    let matched_coloring = undefined
    for(let coloring_regex of coloring_regexes) {
        if(coloring_regex.test(display_name)) {
            matched_coloring = coloring_regex.exec(display_name)
            break
        }
    }
    if(matched_coloring != undefined)
        display_name = matched_coloring[1] + '§8' + matched_coloring[2] + '§r' + matched_coloring[3]

    if(type == undefined) type = "basic"
    return event.create('infirators:' + name.toLowerCase(), type)
                .material('slime')
                .resistance(999999)
                .displayName(display_name)
}

onEvent('block.registry', event => {
    create_block_base(event, 'InfiRator', 'stone_button')
        .hardness(1)
        .noDrops()
        .speedFactor(1.5)

    create_block_base(event, 'InfiRatorRator', 'wall')
        .hardness(8)
        .jumpFactor(5)

    
    create_block_base(event, 'InfiRatorRator_recharging')
        .unbreakable()
        .jumpFactor(5)
        .box(6, 0, 6, 10, 16, 10, true)
        .randomTick(tick => {
            if(tick.random.nextFloat() < 0.05) {
                tick.block.set('infirators:infiratorrator')
            }
        })
    


    for(let inf of [["down", [0, 0, 0, 16, 8, 16]], ["up", [0, 8, 0, 16, 16, 16]], ["north", [0, 0, 0, 16, 16, 8]], ["south", [0, 0, 8, 16, 16, 16]], ["west", [0, 0, 0, 8, 16, 16]], ["east", [8, 0, 0, 16, 16, 16]]]) {
        create_block_base(event, 'InfiRotator_'+inf[0])
            .hardness(1)
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