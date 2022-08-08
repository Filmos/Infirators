var loottables_cache = undefined

function get_loottables(server) {
    if(loottables_cache !== undefined) {
        return loottables_cache
    }

    loottables = server.getMinecraftServer().m_129898_().getIds().stream().map(rl => `${rl}`).filter(x => !x.match(/^[^:]+:blocks\//i)).toList().map(x => {
        return {
            "type": "loottable",
            "loottable": x,
            "name": `Loot table ${x}`,
            "times": 1
    }})

    tagDict = {}
    invalidItems = {}
    for(item of Item.list) {
        for(tag of item.tags) {
            if(tagDict[tag] == undefined)
                tagDict[tag] = []
            if(tagDict[tag].includes(item.id))
                invalidItems[item.id] = true
            else
                tagDict[tag].push(item.id)
        }
    }
    
    for(tag in tagDict) {
        tagDict[tag] = tagDict[tag].filter(x => !invalidItems[x])
        if(tagDict[tag].length <= 1)
            continue
        
        loottables.push({
            "type": "item",
            "amount": [1, 4],
            "items": tagDict[tag],
            "name": `Item tag ${tag}`,
            "times": Math.floor(Math.sqrt(tagDict[tag].length))
        })
    }

    loottables_cache = loottables
    return loottables
}

onEvent('block.place', event => {
    loottables = get_loottables(event.server)
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
        drops = event.server.persistentData[event.block.dimension]["infirators"][`${event.block.pos.x} ${event.block.pos.y} ${event.block.pos.z}`]

        if (!Object.keys(drops).includes("type")) {
            drops = {
                "type": "loottable",
                "loottable": drops
            }
            event.server.persistentData[event.block.dimension]["infirators"][`${event.block.pos.x} ${event.block.pos.y} ${event.block.pos.z}`] = drops
        }
        if (!Object.keys(drops).includes("times")) {
            if(drops.type == "loottable") {
                drops.times = 1
            } else if (drops.type == "item") {
                drops.times = Math.floor(Math.sqrt(drops.items.length))
            }
            event.server.persistentData[event.block.dimension]["infirators"][`${event.block.pos.x} ${event.block.pos.y} ${event.block.pos.z}`] = drops
        }

        for(let i=0; i<drops.times; i++) {
            if(drops.type == "loottable") {
                event.server.runCommandSilent(`execute in ${event.block.dimension} run loot spawn ${event.block.pos.x} ${event.block.pos.y} ${event.block.pos.z} loot ${drops.loottable}`)
            } else if(drops.type == "item") {
                item_name = drops.items[Math.floor(Math.random()*drops.items.length)]
                item_count = Math.floor(Math.random()*(drops.amount[1] - drops.amount[0])) + drops.amount[0]
                event.server.runCommandSilent(`execute in ${event.block.dimension} run summon minecraft:item ${event.block.pos.x} ${event.block.pos.y} ${event.block.pos.z} {Item:{id:"${item_name}",Count:${item_count}b},Motion:[${Math.random()*0.2-0.1},${Math.random()*0.2+0.1},${Math.random()*0.2-0.1}]}`)
            }
        }
    }
})

onEvent('block.right_click', event => {
    if(event.block.id == "infirators:infirator") {
        info = event.server.persistentData[event.block.dimension]["infirators"][`${event.block.pos.x} ${event.block.pos.y} ${event.block.pos.z}`]

        if (!Object.keys(info).includes("name") && info["type"] == "loottable") {
            info["name"] = `Loot table ${info["loottable"]}`
            event.server.persistentData[event.block.dimension]["infirators"][`${event.block.pos.x} ${event.block.pos.y} ${event.block.pos.z}`] = info
        }

        if (Object.keys(info).includes("name")) {
            event.player.tell(Component.aqua(info["name"]))
        }
    }
})