//priority: 100

base = LogicBinder.for_template()
                  .drop_loot_on_break()
                  .info_on_right_click()

base.copy_for("infirators:infirator")
    .assign_when_placed()
base.copy_for(["down", "up", "north", "south", "west", "east"].map(dir => `infirators:infirotator_${dir}`))
    .assign_when_needed()

LogicBinder.for("infirators:infiratorrator")
           .transform_to("infirators:infiratorrator_recharging")

LogicBinder.register_event_listeners()