# Elemental Vanguard

js13k 2014 submission

Recommended browser: Chrome

Demo available @ [http://spmurrayzzz.com/dropbox/elemental]

## Description/Lore

*You are the first line of defense against an invasion of baddies that threaten
your civilization's very existence. Armed with only your trusty laser and
elemental weaponry, you must destroy as many enemies as you can before it's
too late... Make no mistake, you will die on this mission as a member of the
Vanguard. The question is how long will you last?*

This game is a space shooter that allows the player to move along the x-axis
freely. The player can fire lasers at oncoming enemies or choose to use
cooldown-restricted elemental weaponry for advanced effects.

The purpose of the game is to survive as long as possible, while accruing the
the highest score. There is no distinct win condition, only death and legacy.

## Elemental Weapons

In addition to the standard, unlimited laser projectile, the player also has
access to elemental weaponry that can only be used every 20 seconds. These
weapons accrue no points when they destroy, or contribute to the destruction of,
enemies. The purpose of these weapons is crowd control to buy you time to
survive. The cooldown timer on the right-hand side of the HUD will let you know
both progress of the global cooldown as well as the timed effect durations.

- Earth
  - Hurls 5 large asteroids at the wave of oncoming enemies.
- Water
  - Slows all enemies for 10 seconds.
- Air
  - Freezes on-screen enemies in place and prevents new enemy creation for 10 seconds.
- Fire
  - Destroys all on-screen enemies and makes the player invincible for 10
  seconds.


## Installation for Development

```bash
sudo npm install -g grunt-cli
npm install
open index.html
```

## Credits

HUD and Ship assets provided by [Scott O'Hara](https://github.com/scottaohara)

WebAudio [patch](https://github.com/spmurrayzzz/ElementalVanguard/commits?author=kevincennis) for [jsfxr](https://github.com/mneubrand/jsfxr) provided by
[Kevin Ennis](https://github.com/kevincennis)
