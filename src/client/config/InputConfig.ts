import { InputConfigType } from "client/types/config_types/InputConfigType";

const InputConfig: InputConfigType = {
	CameraModeCycle: Enum.KeyCode.C,
	CameraSubModeCycle: Enum.KeyCode.X,
	MoveForward: Enum.KeyCode.W,
	MoveBackward: Enum.KeyCode.S,
	MoveRight: Enum.KeyCode.D,
	MoveLeft: Enum.KeyCode.A,
	Jump: Enum.KeyCode.Space,
	Attack: Enum.UserInputType.MouseButton1,
};

export default InputConfig;
