# DFreds Convenient Effects

[![Become a patron](https://github.com/codebard/patron-button-and-widgets-by-codebard/blob/master/images/become_a_patron_button.png?raw=true)](https://www.patreon.com/dfreds) 
<a href="https://www.buymeacoffee.com/dfreds" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

![Foundry Version](https://img.shields.io/badge/Foundry-v0.8.8-informational)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https://forge-vtt.com/api/bazaar/package/dfreds-convenient-effects&colorB=4aa94a)
![Latest Release Download Count](https://img.shields.io/github/downloads/dfreds/dfreds-convenient-effects/latest/dfreds-convenient-effects.zip)
![All Downloads](https://img.shields.io/github/downloads/dfreds/dfreds-convenient-effects/total)

__DFreds Convenient Effects__ is a FoundryVTT module that adds easy to use toggleable active effects for common use cases in the DND5e system.

## Let Me Sell You This

Do you struggle to remember what all those conditions and spells actually do to players and NPCs? Or how they interact? Consider this. Your player just rolled, but you forgot that they were invisible and should have rolled with advantage. But wait a minute, the enemy is also invisible! So now it cancels out. "Oh drats," you think to yourself to further prove this crazy point, "the player also has Bless cast on them! Has that expired yet??"

Sure, you could figure all that out... if you wanna be lame. Or you could be cool and just use this module.

## What This Module Does

This module  helps with the types of issues described above by providing dozens of pre-configured effects for conditions and spells that can all be applied quickly and easily.

### Demo Showcasing Adding Effects and Favorites

![Demo](docs/demo.gif)

### Demo Showcasing Chat Messages and Auto-Expiration of Effects

![Demo 2](docs/demo2.gif)

### Demo Showcasing ATL and Token Magic Integration

![Demo 3](docs/demo3.gif)

### Settings

![Settings](docs/settings.png)

## How to Use

On the controls on the left, two new buttons have been added to the Token Controls. One opens the Convenient Effects application and the other deletes any convenient effects currently applied to the selected token. To apply a new effect, open the application and select the tokens you want to apply to apply an effect to, and then click the effect you want to apply. This will toggle it on or off for the selected tokens. If any tokens are targeted, the effect will be applied to them instead.

## Modules That Help

While not strictly required, the functionalities provided by these modules drastically improve the usage of the various effects included in this module.

- [Times Up](https://foundryvtt.com/packages/times-up) by tposney - Handles spell effects expiring when their time is up or after a certain number of rounds or turns
- [DAE](https://foundryvtt.com/packages/dae) by tposney - With midi-qol, handles various additional expiration effects such as after 1 attack or when an enemy is attacked
- [Midi-QOL](https://foundryvtt.com/packages/midi-qol) by tposney - Handles a vast amount of automation relating to advantage and disadvantage
- [Active Token Lighting](https://foundryvtt.com/packages/ATL) by Kandashi - Certain effects and spells can emit light, and this module allows active effects to do that
- [Token Magic FX](https://foundryvtt.com/packages/tokenmagic) by SecretFire - Certain effects and spells can have an effect applied, and this module allows active effects to do that. Note that this requires DAE active as well.

## My Philosophy

I've noticed over the months that a lot of FoundryVTT modules lack focus and good coding practice. A user should never be in a situation where they forget what any given module does. Additionally, a power user should never be totally lost on what's going on in a module if they dive into it.

In case anyone out there in the void is curious, this is my philosophy when it comes to implementing modules.

- Code should be easy to read, self-documenting, and contain JSDocs for any public functions
- Modules should do one thing, and one thing only. No "Quality of Life" catchalls from me. NO SIREE BOB.
- That thing the module does should do it well, with a minimum amount of initial configuration. It should "[Just Work](https://upload.wikimedia.org/wikipedia/commons/b/bf/ToddHoward2010sm_%28cropped%29.jpg)".
- Additional configuration should only be added if it really makes sense. If the configuration starts to change the thing the module does well, it shouldn't be there.
- Readmes (like this) should be funny AND informative. Please create a pull request if you think it could be funnier or informativer.
