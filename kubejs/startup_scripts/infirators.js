onEvent('block.registry', event => {
    event.create('infirators:infirator', 'stone_button')
        .material('slime')
        .hardness(1)
        .displayName('InfiRator')
        .noDrops()

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
        .randomTick(tick => {
            if(tick.random.nextFloat() < 0.05) {
                tick.block.set('infirators:infiratorrator')
            }
        })
    
})