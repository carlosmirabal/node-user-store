import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {

    // DI
    constructor() { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const { email, name, password } = registerUserDto;

        const existUser = await UserModel.findOne({ email })

        if (existUser) throw CustomError.badRequest("User already exists");

        try {

            const user = new UserModel(registerUserDto);

            user.save();

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return { user: userEntity, token: 'ABC' };

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }
}