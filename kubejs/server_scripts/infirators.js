onEvent('block.place', event => {
    loottables = event.server.getMinecraftServer().m_129898_().getIds().stream().map(rl => `${rl}`).filter(x => !x.match(/^[^:]+:blocks\//i)).toList()
    if(event.block.id == "infirators:infirator") {
        if(event.server.persistentData[event.block.dimension]["infirators"] == undefined)
            event.server.persistentData[event.block.dimension]["infirators"] = {}
        event.server.persistentData[event.block.dimension]["infirators"][`${event.block.pos.x} ${event.block.pos.y} ${event.block.pos.z}`] = loottables[Math.floor(Math.random()*loottables.length)]
    }
})

onEvent('block.break', event => {
    if(event.block.id == "infirators:infiratorrator") {
        event.server.scheduleInTicks(1, ()=>{
            event.block.set("infirators:infiratorrator_recharging")
        })
    }

    if(event.block.id == "infirators:infirator") {
        event.cancel()
        loottable = event.server.persistentData[event.block.dimension]["infirators"][`${event.block.pos.x} ${event.block.pos.y} ${event.block.pos.z}`]
        event.server.runCommandSilent(`execute in ${event.block.dimension} run loot spawn ${event.block.pos.x} ${event.block.pos.y} ${event.block.pos.z} loot ${loottable}`)
    }
})