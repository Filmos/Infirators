//priority: 102

LogicBinder = {
    flags: {},
    add_flag(target, flag, value) {
        if(value == undefined) value = true
        if(this.flags[flag] == undefined)
            this.flags[flag] = {}
        this.flags[flag][target] = value
    },
    remove_flag(target, flag) {
        if(this.has_flag(target, flag))
            this.flags[flag][target] = undefined
    },
    has_flag(target, flag) {
        return this.flags[flag] != undefined && this.flags[flag][target] != undefined
    },
    get_flag(target, flag) {
        if(this.has_flag(target, flag))
            return this.flags[flag][target]
    },

    for(ids) {
        return new LogicBinderUtil(ids)
    },
    for_template() {
        return new LogicBinderUtil()
    },

    register_event_listeners() {
        onEvent('block.place', this.on_place)
        onEvent('block.break', this.on_break)
        onEvent('block.right_click', this.on_right_click)
    },
    on_place(event) {
        if(LogicBinder.has_flag(event.block.id, "assign__when_placed"))
            (new DataManager(event.server, event.block)).set_random()
    },
    on_break(event) {
        let loot_data = new DataManager(event.server, event.block)

        if(LogicBinder.has_flag(event.block.id, "transform__on_break"))
            event.server.scheduleInTicks(1, ()=>{event.block.set(LogicBinder.get_flag(event.block.id, "transform__on_break"))})
    
        if(LogicBinder.has_flag(event.block.id, "drop_loot__on_break")) {
            event.cancel()
            drops = loot_data.get()
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
    },
    on_right_click(event) {
        if(event.hand !== "MAIN_HAND") return
        if(LogicBinder.has_flag(event.block.id, "info__on_right_click") && `${event.item}` == "Item.empty") {
            info = (new DataManager(event.server, event.block)).get()
            if (Object.keys(info).includes("name"))
                event.player.tell(Component.aqua(info["name"]))
        }
    }
}
function LogicBinderUtil(ids) {
    if(ids === undefined) ids = []
    if(!Array.isArray(ids)) ids = [ids]
    this.ids = ids
    this.categories = {}
}
LogicBinderUtil.prototype = {
    set_flag(category, flag, value) {
        flag = `${category}__${flag.split("__").slice(-1)}`

        if(this.categories[category] !== undefined)
            for(let id of this.ids)
                LogicBinder.remove_flag(id, this.categories[category].flag)
        
        for(let id of this.ids)
            LogicBinder.add_flag(id, flag, value)
            this.categories[category] = {flag: flag, value: value}

        return this
    },
    copy_from(source) {
        for(category in source.categories) {
            source_data = source.categories[category]
            this.set_flag(category, source_data.flag, source_data.value)
        }
        return this
    },
    copy_for(ids) {
        new_util = new LogicBinderUtil(ids)
        new_util.copy_from(this)
        return new_util
    },

    assign_when_placed() {return this.set_flag("assign", "when_placed")},
    assign_when_needed() {return this.set_flag("assign", "when_needed")},
    transform_to(new_block) {return this.set_flag("transform", "on_break", new_block)},
    drop_loot_on_break() {return this.set_flag("drop_loot", "on_break")},
    info_on_right_click() {return this.set_flag("info", "on_right_click")},
}