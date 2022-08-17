//priority: 103

var LootManager = {
    check_empty(loottable) {
        // TODO: fix Wrapped java.util.NoSuchElementException: minecraft:this_entity

        if(loottable.indexOf("tombstone:") == 0) return true
        for(let i=0; i<15; i++) {
            loot = Utils.rollChestLoot(loottable)
            for(l of loot) {
                if(`${l}` != "Item.empty") return false
            }
        }
        return true
    },

    generate_cache(server) {
        let loottables = server.getMinecraftServer().m_129898_().getIds().stream()
        .map(rl => `${rl}`)
        .filter(x => !x.match(/^[^:]+:blocks\//i))
        .filter(x => !this.check_empty(x))
        .toList().map(x => {
            return {
                "type": "loottable",
                "loottable": x,
                "name": `Loot table ${x}`,
                "times": 1
        }})

        tagDict = {}
        wordDict = {}
        invalidItems = {}
        for(item of Item.list) {
            if(`${item.getMod()}` == "infirators")
                continue
            for(tag of item.tags) {
                if(tagDict[tag] == undefined)
                    tagDict[tag] = {items: [], max_stack: 4}
                if(tagDict[tag].items.includes(item.id) || invalidItems[item.id] == true)
                    invalidItems[item.id] = true
                else
                    tagDict[tag].items.push(item.id)
                    tagDict[tag].max_stack = Math.min(item.getItem().maxStackSize, tagDict[tag].max_stack)
            }

            for(word of item.name.getString().split(" ")) {
                if(wordDict[word] == undefined)
                    wordDict[word] = {items: [], max_stack: 4}
                if(wordDict[word].items.includes(item.id) || invalidItems[item.id] == true)
                    invalidItems[item.id] = true
                else
                    wordDict[word].items.push(item.id)
                    wordDict[word].max_stack = Math.min(item.getItem().maxStackSize, wordDict[word].max_stack)
            }
        }
        
        for(tag in tagDict) {
            tagDict[tag].items = tagDict[tag].items.filter(x => !invalidItems[x])
            if(tagDict[tag].items.length <= 1)
                continue
            
            loottables.push({
                "type": "item",
                "amount": [1, tagDict[tag].max_stack],
                "items": tagDict[tag].items,
                "name": `Item tag ${tag}`,
                "times": Math.floor(Math.sqrt(tagDict[tag].items.length))
            })
        }

        for(word in wordDict) {
            wordDict[word].items = wordDict[word].items.filter(x => !invalidItems[x])
            if(wordDict[word].items.length <= 2 || wordDict[word].items.length > 30)
                continue
            
            loottables.push({
                "type": "item",
                "amount": [1, wordDict[word].max_stack],
                "items": wordDict[word].items,
                "name": `Common word "${word}"`,
                "times": Math.floor(Math.sqrt(wordDict[word].items.length))
            })
        }

        this.loottables_cache = loottables
    },

    get_all(server) {
        if(this.loottables_cache == undefined)
            this.generate_cache(server)
        return this.loottables_cache
    },

    get_random(server) {
        let loottables = this.get_all(server)
        return loottables[Math.floor(Math.random() * loottables.length)]
    }
}
onEvent('server.datapack.last', event => {
    if(event.server != undefined)
        LootManager.generate_cache(event.server)
})
onEvent('server.load', event => {
    LootManager.generate_cache(event.server)
})