import { RunService, UserInputService } from "@rbxts/services";
import InputService from "client/InputService";
import CharacterService from "./CharacterService";

let lastGrounded = 0;

const ControlService = {
	worldMoveDirection: Vector3.zero,
	AddController: (character: Model) => {},
	Update: (dt: number) => {
		if (!CharacterService.hrp || !CharacterService.hum) return;
		const hrpCF = CharacterService.hrp.CFrame;
		const isGrounded = CharacterService.hum.FloorMaterial !== Enum.Material.Air;

		const moveDirection = new Vector2(
			(UserInputService.IsKeyDown(Enum.KeyCode.W) ? 1 : 0) - (UserInputService.IsKeyDown(Enum.KeyCode.S) ? 1 : 0),
			(UserInputService.IsKeyDown(Enum.KeyCode.D) ? 1 : 0) - (UserInputService.IsKeyDown(Enum.KeyCode.A) ? 1 : 0),
		);

		let worldMoveDirection = hrpCF.RightVector.mul(moveDirection.Y).add(hrpCF.LookVector.mul(moveDirection.X));

		if (isGrounded && !lastGrounded) {
			lastGrounded = os.clock();
		} else if (!isGrounded) {
			lastGrounded = 0;
		}

		if (worldMoveDirection === Vector3.zero && (!isGrounded || (lastGrounded && os.clock() - lastGrounded < 0.25)))
			worldMoveDirection = ControlService.worldMoveDirection;

		CharacterService.hum.Move(ControlService.worldMoveDirection.Lerp(worldMoveDirection, 10 * dt));
		ControlService.worldMoveDirection = worldMoveDirection;

		if (isGrounded && UserInputService.IsKeyDown(Enum.KeyCode.Space)) {
			CharacterService.hum.Jump = true;
		}
	},
	Start: () => {
		RunService.Heartbeat.Connect(ControlService.Update);
	},
};

export default ControlService;
