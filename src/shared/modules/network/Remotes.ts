import Net from "@rbxts/net";

const Remotes = Net.Definitions.Create({
   // PrintMessage: Net.Definitions.ClientToServerEvent<[message: string]>(),
   // MakeHello: Net.Definitions.ServerAsyncFunction<(message: string) => string>()
   CharacterAbilityDash: Net.Definitions.ClientToServerEvent<[]>(),
});

export default Remotes;