import Remotes from "shared/modules/network/Remotes";

const Events = {
    Character: {
        Ability: {
            Dash: Remotes.Server.Get("CharacterAbilityDash")
        }
    }
}

export default Events;