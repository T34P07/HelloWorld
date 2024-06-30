import Remotes from "shared/modules/network/Remotes";

const Events = {
    Character: {
        Ability: {
            Dash: Remotes.Server.Get("CharacterAbilityDash")
        },
    },
    Weapons: {
        Damage: {
            Deal: Remotes.Server.Get("WeaponsDamageDeal")
        }
    }
}

export default Events;
