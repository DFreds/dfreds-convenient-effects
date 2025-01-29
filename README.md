<div align="center">
  <img src="https://i.imgur.com/gOZy3Jf.png" width="200" height="200"/>
</div>
<h1 align="center">DFreds Convenient Effects</h1>

<h4 align="center">
  <a href="https://foundryvtt.com/packages/dfreds-convenient-effects">Install</a>
  ·
  <a href="https://discord.gg/Wq8AEV9bWb">Discord</a>
  ·
  <a href="https://github.com/topics/dfreds-modules">Other Modules</a>
</h4>

<p align="center">
    <a href="https://github.com/DFreds/dfreds-convenient-effects/pulse"><img src="https://img.shields.io/github/last-commit/DFreds/dfreds-convenient-effects?style=for-the-badge&logo=github&color=7dc4e4&logoColor=D9E0EE&labelColor=302D41"></a>
    <a href="https://github.com/DFreds/dfreds-convenient-effects/releases/latest"><img src="https://img.shields.io/github/v/release/DFreds/dfreds-convenient-effects?style=for-the-badge&logo=gitbook&color=8bd5ca&logoColor=D9E0EE&labelColor=302D41"></a>
    <a href="https://github.com/DFreds/dfreds-convenient-effects/stargazers"><img src="https://img.shields.io/github/stars/DFreds/dfreds-convenient-effects?style=for-the-badge&logo=apachespark&color=eed49f&logoColor=D9E0EE&labelColor=302D41"></a>
    <br>
    <br>
    <img src="https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/DFreds/dfreds-convenient-effects/main/static/module.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=fe6a1f&style=for-the-badge&logo=foundryvirtualtabletop">
    <a href="https://forge-vtt.com/bazaar#package=dfreds-convenient-effects"><img src="https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https://forge-vtt.com/api/bazaar/package/dfreds-convenient-effects&colorB=68a74f&style=for-the-badge&logo=condaforge"></a>
    <br>
    <img src="https://img.shields.io/github/downloads/DFreds/dfreds-convenient-effects/latest/dfreds-convenient-effects.zip?color=2b82fc&label=LATEST%20DOWNLOADS&style=for-the-badge">
    <img src="https://img.shields.io/github/downloads/DFreds/dfreds-convenient-effects/total?color=2b82fc&label=TOTAL%20DOWNLOADS&style=for-the-badge">
    <br>
    <br>
    <a href="https://www.patreon.com/dfreds"><img src="https://img.shields.io/badge/-Patreon-%23f96854?style=for-the-badge&logo=patreon"></a>
    <a href="https://www.buymeacoffee.com/dfreds"><img src="https://img.shields.io/badge/-Buy%20Me%20A%20Coffee-%23ff813f?style=for-the-badge&logo=buymeacoffee"></a>
    <a href="https://discord.gg/Wq8AEV9bWb"><img src="https://img.shields.io/badge/-Discord-%235865f2?style=for-the-badge"></a>
</p>

<p align="center">
    <b>DFreds Convenient Effects</b> is a FoundryVTT module that adds easy to use toggleable active effects for common use cases. Currently, the DND5e and SW5e systems have pre-created effects, but any system can create their own effects.
</p>

## Let Me Sell You This

Do you struggle to remember what all those conditions and spells actually do to
players and NPCs? Or how they interact? Consider this. Your player just rolled,
but you forgot that they were invisible and should have rolled with advantage.
But wait a minute, the enemy is also invisible! So now it cancels out. "Oh
drats," you think to yourself to further prove this crazy point, "the player
also has Bless cast on them! Has that expired yet??"

Sure, you could figure all that out... if you wanna be lame. Or you could be
cool and just use this module.

## What This Module Does

This module helps with the types of issues described above by allowing creation
of active effects that can be applied quickly and easily. For DND5e and SW5e, it
provides dozens of pre-configured effects for conditions and spells.

You can configure some stuff:

![Settings](docs/settings.png)

## How to Use

Check the [User
Guide](https://github.com/DFreds/dfreds-convenient-effects/wiki/User-Guide) for
details.

Developers should check out the [Developer
Guide](https://github.com/DFreds/dfreds-convenient-effects/wiki/Developer-Guide).

## Required Modules

- [libWrapper](https://foundryvtt.com/packages/lib-wrapper) by ruipin - A
library that wraps core Foundry methods to make it easier for modules developers
to do their thang. Note that if you for some reason don't want to install this,
a shim will be used instead. You'll be pestered to install it though so... [just
do it](https://www.youtube.com/watch?v=ZXsQAXx_ao0)
- [socketlib](https://foundryvtt.com/packages/socketlib) by Stäbchenfisch - A
library that makes it easy to do difficult things with sockets
- [Lib: DFreds UI Extender](https://foundryvtt.com/packages/lib-dfreds-ui-extender) by DFreds (that's me) - A library that makes it easy to add new UI elements to Foundry

## Modules That Help

While not strictly required, the functionalities provided by these modules drastically improve the usage of the various effects included in this module.

- [Times Up](https://foundryvtt.com/packages/times-up) by tim posney - Deletes
effects when their time is up or after a certain number of rounds or turns
- [DAE](https://foundryvtt.com/packages/dae) by tim posney - With midi-qol,
handles various additional expiration effects such as after 1 attack or when an
enemy is attacked
- [Midi-QOL](https://foundryvtt.com/packages/midi-qol) by tim posney - Handles a
vast amount of automation relating to advantage and disadvantage
- [Active Token Lighting](https://foundryvtt.com/packages/ATL) by kaelad -
Certain effects and spells can emit light, and this module allows active effects
to do that
- [Token Magic FX](https://foundryvtt.com/packages/tokenmagic) by SecretFire -
Certain effects and spells can have an effect applied, and this module allows
active effects to do that. Note that this requires DAE active as well.
