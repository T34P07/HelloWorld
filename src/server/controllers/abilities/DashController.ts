import Events from "server/modules/Events";

const DashController = {
    Start: () => {
       Events.Character.Ability.Dash.Connect((player: Player) => {
           const character = player.Character;
           if (!character) return;

           character.AddTag("Dash");

           task.delay(.3, () => {
            character.RemoveTag("Dash");
           })
       });
    }
}

export default DashController;
