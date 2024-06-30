import Remotes from "shared/modules/network/Remotes";

const Events = {
    Character: {
        Ability: {
            Dash: Remotes.Client.Get("CharacterAbilityDash")
        },
    },
    Weapons: {
        Damage: {
            Deal: Remotes.Client.Get("WeaponsDamageDeal")
        }
    }
}

export default Events;
