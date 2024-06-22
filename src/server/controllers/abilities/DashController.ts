import Events from "server/modules/Events";

const DashController = {
    Start: () => {
        Events.Character.Ability.Dash.Connect((player: Player) => {
            print("DASH!")
        });
    }
}

export default DashController;