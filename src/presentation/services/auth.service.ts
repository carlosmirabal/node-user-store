import { bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {

    // DI
    constructor() { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const { email } = registerUserDto;

        const existUser = await UserModel.findOne({ email })

        if (existUser) throw CustomError.badRequest("User already exists");

        try {

            const user = new UserModel(registerUserDto);

            // Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password)

            user.save();

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return { user: userEntity, token: 'ABC' };

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        // Find user
        const user = await UserModel.findOne({ email: loginUserDto.email })

        if (!user) throw CustomError.badRequest("Email not exist");

        // Compare password
        const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password)

        if (!isMatching) throw CustomError.badRequest("Invalid password");

        const { password, ...userEntity } = UserEntity.fromObject(user);

        // Generate token
        const token = 'ABC'

        // Return user and token
        return { user: userEntity, token };
    }
}