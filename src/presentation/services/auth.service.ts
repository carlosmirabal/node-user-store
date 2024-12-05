import { UserModel } from "../../data";
import { CustomError, RegisterUserDto } from "../../domain";

export class AuthService {

    constructor() { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const { email, name, password } = registerUserDto;

        const existUser = await UserModel.findOne({ email })

        if (existUser) throw CustomError.badRequest("User already exists");

        return "ok"
    }
}