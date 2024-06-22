import Remotes from "shared/modules/network/Remotes";

const Events = {
    Character: {
        Ability: {
            Dash: Remotes.Client.Get("CharacterAbilityDash")
        }
    }
}

export default Events;