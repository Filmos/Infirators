//priority: 101

function DataManager(server, block) {
    this.server = server
    this.block = block
}
DataManager.prototype = {
    position_key() {
        return `${this.block.pos.x} ${this.block.pos.y} ${this.block.pos.z}`
    },
    set(loottable) {
        if(this.server.persistentData[this.block.dimension]["infirators"] == undefined)
            this.server.persistentData[this.block.dimension]["infirators"] = {}
        this.server.persistentData[this.block.dimension]["infirators"][this.position_key()] = loottable
    },
    get() {
        if(this.eventless_get() == undefined && LogicBinder.has_flag(this.block.id, "assign__when_needed"))
            this.set_random()
        return this.eventless_get()
    },
    eventless_get() {
        if(this.server.persistentData[this.block.dimension]["infirators"] == undefined)
            return
        return this.server.persistentData[this.block.dimension]["infirators"][this.position_key()]
    },

    set_random() {
        this.set(LootManager.get_random(this.server))
    }
}